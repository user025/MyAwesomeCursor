import type {
  ActiveProjectView,
  Choice,
  ChoiceRelationshipEvent,
  ChoiceResult,
  EndingInfo,
  ExtraAfterEndingConfig,
  HealthConfig,
  Player,
  PlayerTimeState,
  ProjectDef,
  Scene,
  StoryConfig,
  StoryTimeConfig,
} from './types';
import { evaluateHealth } from './health';
import { addXp, applyEffects, createChapterTimeState, spendTime, type StatKeys } from './player';
import { evaluateChapterTimeout } from './timeout';
import type { ItemEngine } from './ItemEngine';

/**
 * 剧情引擎：管理场景图、选项过滤与选项解析。
 * 场景数据通过 StoryConfig 注入，与具体故事内容解耦。
 */
export class StoryEngine {
  private readonly scenes: Record<string, Scene>;
  private readonly startScene: string;
  private readonly endingPrefix: string;
  private readonly statLabels: Record<string, string>;
  private readonly timeConfig?: StoryTimeConfig;
  private readonly projects?: ProjectDef[];
  private readonly healthConfig?: HealthConfig;
  private readonly extraAfterEnding?: ExtraAfterEndingConfig;
  private readonly itemEngine: ItemEngine;

  constructor(config: StoryConfig, itemEngine: ItemEngine) {
    this.scenes = config.scenes;
    this.startScene = config.startScene;
    this.endingPrefix = config.endingPrefix ?? 'ending_';
    this.statLabels = config.statLabels ?? {};
    this.timeConfig = config.time;
    this.projects = config.projects;
    this.healthConfig = config.health;
    this.extraAfterEnding = config.extraAfterEnding;
    this.itemEngine = itemEngine;
  }

  getStartSceneId(): string {
    return this.startScene;
  }

  getScene(sceneId: string): Scene | undefined {
    return this.scenes[sceneId];
  }

  createInitialTimeState(): PlayerTimeState | undefined {
    if (!this.timeConfig) return undefined;
    const chapter = this.timeConfig.chapters[this.timeConfig.defaultChapterId];
    return chapter ? createChapterTimeState(chapter) : undefined;
  }

  createCheckpoint(player: Player, sceneId: string) {
    const chapterId = player.time?.chapterId;
    if (!chapterId) return undefined;

    const checkpointPlayer: Player = {
      ...player,
      chapterCheckpoint: undefined,
    };

    return {
      chapterId,
      sceneId,
      player: checkpointPlayer,
    };
  }

  restoreChapterCheckpoint(player: Player): { player: Player; sceneId: string } | null {
    const checkpoint = player.chapterCheckpoint;
    if (!checkpoint) return null;

    if (this.extraAfterEnding && checkpoint.chapterId === this.extraAfterEnding.chapterId) {
      return null;
    }

    return {
      player: {
        ...checkpoint.player,
        chapterCheckpoint: checkpoint,
        pendingEndingScene: undefined,
      },
      sceneId: checkpoint.sceneId,
    };
  }

  isEnding(sceneId: string): boolean {
    return sceneId.startsWith(this.endingPrefix);
  }

  getChoiceTimeCost(choice: Choice, player: Player): number {
    if (player.time && !player.time.enabled) return 0;
    if (this.isChapterTransition(choice, player)) return 0;
    return choice.timeCost ?? player.time?.defaultActionTimeCost ?? 0;
  }

  /** 根据玩家状态过滤可用选项 */
  getAvailableChoices(sceneId: string, player: Player): Choice[] {
    return this.getSceneChoices(sceneId, player).filter(choice => this.isChoiceAvailable(choice, player));
  }

  getSceneChoices(sceneId: string, player?: Player): Choice[] {
    const scene = this.scenes[sceneId];
    if (!scene) return [];

    const extra = this.extraAfterEnding;
    if (player && extra && this.isEnding(sceneId) && !player.flags.extra_completed) {
      return [{
        id: `to_extra_from_${sceneId}`,
        text: '【番外】用工牌参加行业活动',
        nextScene: extra.sceneId,
        requireItem: 'badge',
        lockedText: '需持有工牌',
        narrative: '结局已尘埃落定。你摸着口袋里的工牌——也许还能用它打开一扇通往外面的门。',
      }];
    }

    return scene.choices;
  }

  isChoiceAvailable(choice: Choice, player: Player): boolean {
    if (choice.requireItem && !this.itemEngine.playerHasItem(player, choice.requireItem)) {
      return false;
    }
    if (choice.requireFlags?.some(flag => !player.flags[flag])) {
      return false;
    }
    if (choice.requireFlag && !player.flags[choice.requireFlag]) {
      return false;
    }
    return true;
  }

  getHealthConfig(): HealthConfig | undefined {
    return this.healthConfig;
  }

  getActiveProject(sceneId: string, player: Player): ActiveProjectView | null {
    if (!this.projects) return null;

    for (const project of this.projects) {
      if (!project.hubSceneIds.includes(sceneId)) continue;
      if (player.flags[project.completeFlag]) continue;

      const spentHours = player.projectWork?.[project.id] ?? 0;
      return {
        id: project.id,
        name: project.name,
        requiredHours: project.requiredHours,
        spentHours,
        remainingHours: Math.max(0, project.requiredHours - spentHours),
        unit: player.time?.unit ?? '小时',
      };
    }

    return null;
  }

  /** 解析玩家选择，返回下一场景与状态变更 */
  resolveChoice(choice: Choice, player: Player, currentSceneId?: string): ChoiceResult {
    let p = { ...player };
    let nextSceneId = choice.nextScene;
    let narrative: string | null = choice.narrative ?? null;
    const logEntries: string[] = [];
    const toastEntries: string[] = [];
    let leveledUp = false;
    const timeCost = this.getChoiceTimeCost(choice, p);

    p = spendTime(p, timeCost);
    if (timeCost > 0 && p.time) {
      const timeMessage = `时间 -${timeCost}${p.time.unit}，剩余 ${p.time.remaining}${p.time.unit}`;
      logEntries.push(timeMessage);
      toastEntries.push(timeMessage);
    }

    p = this.applyProjectWork(choice, timeCost, p, logEntries, toastEntries);

    if (choice.statCheck) {
      const val = p[choice.statCheck.stat] as number;
      if (val < choice.statCheck.min) {
        nextSceneId = choice.statCheck.failScene;
        narrative = choice.statCheck.failText;
        const label = this.statLabels[choice.statCheck.stat] ?? choice.statCheck.stat;
        logEntries.push(`属性不足：${label} ${val} < ${choice.statCheck.min}`);
      }
    }

    if (choice.repeatableEffects) {
      const repeatableResult = this.applyChoiceEffects(p, choice.repeatableEffects, choice);
      p = repeatableResult.player;
      if (repeatableResult.restBlocked) {
        logEntries.push('本章休息恢复已使用过。');
      }
      const repeatableMessage = this.formatEffectChange(repeatableResult.effects);
      if (repeatableMessage) {
        const text = `属性变化：${repeatableMessage}`;
        logEntries.push(text);
        toastEntries.push(text);
      }
    }

    if (choice.effects && !p.resolvedEffectChoices.includes(choice.id)) {
      const result = addXp(p, choice.effects.xp ?? 0);
      p = result.player;
      if (result.leveledUp) {
        leveledUp = true;
        logEntries.push('升级！');
      }
      const { xp: _xp, ...rest } = choice.effects;
      const effectResult = this.applyChoiceEffects(p, rest, choice);
      p = effectResult.player;
      if (effectResult.restBlocked) {
        logEntries.push('本章休息恢复已使用过。');
      }
      const effectMessage = this.formatEffectChange(effectResult.effects);
      if (effectMessage) {
        const text = `属性变化：${effectMessage}`;
        logEntries.push(text);
        toastEntries.push(text);
      }
      p = {
        ...p,
        resolvedEffectChoices: [...p.resolvedEffectChoices, choice.id],
      };
    } else if (choice.effects) {
      logEntries.push('该选项的属性影响已结算过，不会重复生效。');
    }

    if (choice.giveItem) {
      const grantResult = this.itemEngine.grantItem(p, choice.giveItem);
      p = grantResult.player;
      if (grantResult.logEntry) {
        logEntries.push(grantResult.logEntry);
      }
      if (grantResult.narrative) {
        narrative = narrative ? `${narrative}\n\n${grantResult.narrative}` : grantResult.narrative;
      }
    }

    if (choice.setFlag) {
      p = { ...p, flags: { ...p.flags, [choice.setFlag]: true } };
    }

    p = this.recordRelationships(p, choice, logEntries);

    const timeoutResult = evaluateChapterTimeout(p, this.timeConfig);
    if (timeoutResult && !this.isEnding(nextSceneId)) {
      nextSceneId = timeoutResult.sceneId;
      narrative = timeoutResult.text;
      if (timeoutResult.passed) {
        logEntries.push('时间用尽，本章目标已达成。');
        toastEntries.push('时间用尽，本章通关。');
      } else {
        logEntries.push('时间耗尽。');
      }
    }

    const healthResult = evaluateHealth(p, this.healthConfig);
    if (healthResult.critical && healthResult.endingSceneId && !this.isEnding(nextSceneId)) {
      nextSceneId = healthResult.endingSceneId;
      narrative = healthResult.narrative ?? narrative;
      logEntries.push('健康崩溃，你无法继续工作。');
      toastEntries.push('健康值过低，你已倒下。');
    }

    if (
      this.extraAfterEnding
      && currentSceneId
      && this.isEnding(currentSceneId)
      && nextSceneId === this.extraAfterEnding.sceneId
    ) {
      p = {
        ...p,
        pendingEndingScene: currentSceneId,
        flags: { ...p.flags, extra_from_ending: true },
      };
      logEntries.push('结局已揭晓，番外篇开启。');
    }

    const transition = this.applyExtraTransition(nextSceneId, p);
    nextSceneId = transition.sceneId;
    p = transition.player;
    logEntries.push(...transition.logEntries);

    const previousChapterId = p.time?.chapterId;
    p = this.enterSceneChapter(p, nextSceneId, logEntries);
    const enteredExtraChapter = this.extraAfterEnding?.chapterId === p.time?.chapterId;
    if (p.time?.chapterId && p.time.chapterId !== previousChapterId && !enteredExtraChapter) {
      p = {
        ...p,
        chapterCheckpoint: this.createCheckpoint(p, p.time.startScene),
      };
    }
    p = { ...p, visitedScenes: [...p.visitedScenes, nextSceneId] };

    return { player: p, nextSceneId, narrative, logEntries, toastEntries, leveledUp, timeCost };
  }

  /** 根据场景与 flags 解析结局展示信息 */
  getEndingInfo(
    sceneId: string,
    flags: Record<string, boolean>,
    endings?: Record<string, EndingInfo>,
  ): EndingInfo | null {
    if (!this.isEnding(sceneId) || !endings) return null;

    if (flags.ending_victory && endings.ending_victory) return endings.ending_victory;
    if (flags.ending_good && endings.ending_good) return endings.ending_good;
    if (sceneId === 'ending_bad' && endings.ending_bad) return endings.ending_bad;
    if (sceneId === 'ending_neutral' && endings.ending_neutral) return endings.ending_neutral;
    if (endings[sceneId]) return endings[sceneId];

    return null;
  }

  private applyChoiceEffects(
    player: Player,
    effects: Partial<Record<StatKeys, number>>,
    choice: Choice,
  ): { player: Player; effects: Partial<Record<StatKeys, number>>; restBlocked: boolean } {
    const filtered = { ...effects };
    let restBlocked = false;

    if (choice.chapterRestFlag && filtered.hp) {
      if (player.flags[choice.chapterRestFlag]) {
        delete filtered.hp;
        restBlocked = true;
      }
    }

    const playerAfterEffects = Object.keys(filtered).length > 0
      ? applyEffects(player, filtered)
      : player;

    if (
      choice.chapterRestFlag
      && effects.hp
      && effects.hp > 0
      && !player.flags[choice.chapterRestFlag]
    ) {
      return {
        player: {
          ...playerAfterEffects,
          flags: { ...playerAfterEffects.flags, [choice.chapterRestFlag]: true },
        },
        effects: filtered,
        restBlocked: false,
      };
    }

    return { player: playerAfterEffects, effects: filtered, restBlocked };
  }

  private applyProjectWork(
    choice: Choice,
    timeCost: number,
    player: Player,
    logEntries: string[],
    toastEntries: string[],
  ): Player {
    if (!this.projects || timeCost <= 0) return player;

    const project = this.projects.find(item => item.workChoiceIds.includes(choice.id));
    if (!project || player.flags[project.completeFlag]) return player;

    const spentHours = (player.projectWork?.[project.id] ?? 0) + timeCost;
    let p: Player = {
      ...player,
      projectWork: { ...player.projectWork, [project.id]: spentHours },
    };
    const unit = player.time?.unit ?? '小时';
    const remainingHours = Math.max(0, project.requiredHours - spentHours);
    const progressMessage = `项目「${project.name}」：已投入 ${spentHours}/${project.requiredHours}${unit}，剩余 ${remainingHours}${unit}`;
    logEntries.push(progressMessage);
    toastEntries.push(progressMessage);

    if (spentHours >= project.requiredHours) {
      p = { ...p, flags: { ...p.flags, [project.completeFlag]: true } };
      const completeMessage = `项目「${project.name}」已完成！`;
      logEntries.push(completeMessage);
      toastEntries.push(completeMessage);
    }

    return p;
  }

  private recordRelationships(player: Player, choice: Choice, logEntries: string[]): Player {
    if (!choice.relationships) return player;

    const events = Array.isArray(choice.relationships)
      ? choice.relationships
      : [choice.relationships];

    const relationships = { ...player.relationships };
    for (const event of events) {
      const current = relationships[event.characterId] ?? {
        characterId: event.characterId,
        affinity: 0,
        interactions: [],
      };
      const interaction = this.createInteraction(event, choice);
      relationships[event.characterId] = {
        ...current,
        affinity: current.affinity + (event.affinityDelta ?? 0),
        interactions: [...current.interactions, interaction],
      };
      logEntries.push(`人物关系：${event.summary}`);
    }

    return { ...player, relationships };
  }

  private createInteraction(event: ChoiceRelationshipEvent, choice: Choice) {
    return {
      choiceId: choice.id,
      summary: event.summary,
      affinityDelta: event.affinityDelta,
    };
  }

  private enterSceneChapter(player: Player, sceneId: string, logEntries: string[]): Player {
    if (!this.timeConfig) return player;

    const scene = this.scenes[sceneId];
    const chapterId = scene?.chapterId ?? player.time?.chapterId ?? this.timeConfig.defaultChapterId;
    if (player.time?.chapterId === chapterId) return player;

    const chapter = this.timeConfig.chapters[chapterId];
    if (!chapter) return player;

    const time = createChapterTimeState(chapter);
    if (time.enabled) {
      logEntries.push(`进入篇章：${chapter.name}，可用时间 ${time.total}${time.unit}`);
    } else {
      logEntries.push(`进入篇章：${chapter.name}`);
    }
    return { ...player, time };
  }

  private formatEffectChange(effects: Partial<Record<string, number>>): string | null {
    const entries = Object.entries(effects).filter((entry): entry is [string, number] => {
      const value = entry[1];
      return typeof value === 'number' && value !== 0;
    });
    if (entries.length === 0) return null;

    return entries
      .map(([key, value]) => {
        const label = this.statLabels[key] ?? key;
        return `${label}${value > 0 ? '+' : ''}${value}`;
      })
      .join('，');
  }

  /** 将目标场景解析为实际跳转（含番外结束后的回跳） */
  navigateToScene(targetSceneId: string, player: Player): {
    sceneId: string;
    player: Player;
    logEntries: string[];
  } {
    const logEntries: string[] = [];
    const transition = this.applyExtraTransition(targetSceneId, player);
    let p = transition.player;
    let sceneId = transition.sceneId;
    logEntries.push(...transition.logEntries);
    p = this.enterSceneChapter(p, sceneId, logEntries);
    p = { ...p, visitedScenes: [...p.visitedScenes, sceneId] };
    return { sceneId, player: p, logEntries };
  }

  private applyExtraTransition(
    targetSceneId: string,
    player: Player,
  ): { sceneId: string; player: Player; logEntries: string[] } {
    const extra = this.extraAfterEnding;
    if (!extra) {
      return { sceneId: targetSceneId, player, logEntries: [] };
    }

    const inExtraChapter = player.time?.chapterId === extra.chapterId;

    if (
      inExtraChapter
      && player.pendingEndingScene
      && extra.exitSceneIds.includes(targetSceneId)
    ) {
      const endingSceneId = player.pendingEndingScene;
      return {
        sceneId: endingSceneId,
        player: {
          ...player,
          pendingEndingScene: undefined,
          flags: { ...player.flags, extra_completed: true },
        },
        logEntries: ['番外篇结束，回到你的结局。'],
      };
    }

    if (inExtraChapter && this.isEnding(targetSceneId)) {
      return {
        sceneId: targetSceneId,
        player: {
          ...player,
          pendingEndingScene: undefined,
          flags: { ...player.flags, extra_completed: true },
        },
        logEntries: [],
      };
    }

    return { sceneId: targetSceneId, player, logEntries: [] };
  }

  private isChapterTransition(choice: Choice, player: Player): boolean {
    if (!player.time?.chapterId) return false;
    const nextScene = this.scenes[choice.nextScene];
    if (!nextScene?.chapterId) return false;
    return nextScene.chapterId !== player.time.chapterId;
  }
}
