import type {
  HealthConfig,
  ItemDef,
  ItemFunctionDef,
  ItemFunctionState,
  ItemQuantityMode,
  ItemUseResult,
  Player,
  StoryTimeConfig,
} from './types';
import { evaluateHealth } from './health';
import { addItem, applyEffects, removeItem, spendTime } from './player';
import { evaluateChapterTimeout } from './timeout';

interface ItemGrantResult {
  player: Player;
  granted: boolean;
  logEntry: string | null;
  narrative: string | null;
}

/**
 * 道具引擎：管理道具注册表，处理使用、查询与展示文案。
 * 与具体剧情无关，仅依赖 ItemDef 数据。
 */
export class ItemEngine {
  private readonly items: Record<string, ItemDef>;
  private readonly statLabels: Record<string, string>;
  private readonly healthConfig?: HealthConfig;
  private readonly timeConfig?: StoryTimeConfig;

  constructor(
    items: Record<string, ItemDef>,
    statLabels?: Record<string, string>,
    healthConfig?: HealthConfig,
    timeConfig?: StoryTimeConfig,
  ) {
    this.items = items;
    this.statLabels = statLabels ?? {};
    this.healthConfig = healthConfig;
    this.timeConfig = timeConfig;
  }

  getItem(itemId: string): ItemDef | undefined {
    return this.items[itemId];
  }

  getAllItems(): Record<string, ItemDef> {
    return this.items;
  }

  hasItemDefinition(itemId: string): boolean {
    return itemId in this.items;
  }

  playerHasItem(player: Player, itemId: string): boolean {
    return player.inventory.some(i => i.itemId === itemId && i.quantity > 0);
  }

  canUse(itemId: string): boolean {
    const def = this.items[itemId];
    return def?.type === 'consumable';
  }

  getQuantityMode(itemId: string): ItemQuantityMode | null {
    const def = this.items[itemId];
    if (!def) return null;
    return this.resolveQuantityMode(def);
  }

  grantItem(player: Player, itemId: string): ItemGrantResult {
    const def = this.items[itemId];
    if (!def) {
      return { player, granted: false, logEntry: null, narrative: null };
    }

    const mode = this.resolveQuantityMode(def);
    if (mode === 'global' && this.playerHasItem(player, itemId)) {
      return {
        player,
        granted: false,
        logEntry: `已拥有：${def.emoji} ${def.name}（全局道具不会重复领取）`,
        narrative: null,
      };
    }

    return {
      player: addItem(player, itemId),
      granted: true,
      logEntry: this.formatGrantLog(itemId),
      narrative: this.formatGrantNarrative(itemId),
    };
  }

  getFunctions(player: Player, itemId: string): ItemFunctionState[] {
    const def = this.items[itemId];
    if (!def) return [];

    const functions = def.functions ?? this.getDefaultFunctions(def);
    return functions.map(fn => ({
      ...fn,
      unlocked: !fn.unlockFlag || Boolean(player.flags[fn.unlockFlag]),
      resolvedTimeCost: player.time?.enabled ? fn.timeCost ?? player.time.defaultItemTimeCost : 0,
      resolvedTimeUnit: player.time?.unit ?? '分钟',
    }));
  }

  /** 使用消耗品，返回更新后的玩家状态；不可用时返回 null */
  useItem(player: Player, itemId: string, functionId = 'use'): ItemUseResult | null {
    const def = this.items[itemId];
    if (!def || def.type !== 'consumable') return null;
    if (!this.playerHasItem(player, itemId)) return null;

    const fn = this.getFunctions(player, itemId).find(itemFunction => itemFunction.id === functionId);
    if (!fn || !fn.unlocked || fn.action !== 'use') return null;

    let p = applyEffects(player, def.effects);
    const timeCost = fn.resolvedTimeCost;
    p = spendTime(p, timeCost);
    p = removeItem(p, itemId);

    const logEntries = [`使用了 ${def.name}。${def.description}`];
    const toastEntries: string[] = [];
    if (timeCost > 0 && p.time) {
      const timeMessage = `时间 -${timeCost}${p.time.unit}，剩余 ${p.time.remaining}${p.time.unit}`;
      logEntries.push(timeMessage);
      toastEntries.push(timeMessage);
    }

    const effectMessage = this.formatEffectChange(def.effects);
    if (effectMessage) {
      const text = `属性变化：${effectMessage}`;
      logEntries.push(text);
      toastEntries.push(text);
    }

    const healthResult = evaluateHealth(p, this.healthConfig);
    if (healthResult.critical && healthResult.endingSceneId) {
      logEntries.push('健康崩溃，你无法继续工作。');
      toastEntries.push('健康值过低，你已倒下。');
      return {
        player: p,
        logEntries,
        toastEntries,
        timeCost,
        healthEnding: {
          sceneId: healthResult.endingSceneId,
          narrative: healthResult.narrative ?? '',
        },
      };
    }

    const timeoutResult = evaluateChapterTimeout(p, this.timeConfig);
    if (timeoutResult) {
      if (timeoutResult.passed) {
        logEntries.push('时间用尽，本章目标已达成。');
        toastEntries.push('时间用尽，本章通关。');
      } else {
        logEntries.push('时间耗尽。');
      }
      return {
        player: p,
        logEntries,
        toastEntries,
        timeCost,
        timeoutTransition: {
          sceneId: timeoutResult.sceneId,
          narrative: timeoutResult.text,
        },
      };
    }

    return {
      player: p,
      logEntries,
      toastEntries,
      timeCost,
    };
  }

  /** 生成获得道具的日志文案 */
  formatGrantLog(itemId: string): string | null {
    const def = this.items[itemId];
    if (!def) return null;
    return `获得：${def.emoji} ${def.name}`;
  }

  /** 生成获得道具的叙事补充文案 */
  formatGrantNarrative(itemId: string): string | null {
    const def = this.items[itemId];
    if (!def) return null;
    return `获得：${def.emoji} ${def.name} — ${def.description}`;
  }

  private getDefaultFunctions(def: ItemDef): ItemFunctionDef[] {
    if (def.type === 'consumable') {
      return [
        {
          id: 'use',
          name: '使用',
          description: this.formatEffects(def),
          action: 'use',
        },
      ];
    }

    return [
      {
        id: 'inspect',
        name: '查看',
        description: def.description,
      },
    ];
  }

  private formatEffects(def: ItemDef): string {
    const entries = Object.entries(def.effects);
    if (entries.length === 0) return def.description;

    const effectText = entries
      .map(([stat, value]) => `${stat} ${value > 0 ? '+' : ''}${value}`)
      .join('，');
    return `${def.description} 效果：${effectText}。`;
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

  private resolveQuantityMode(def: ItemDef): ItemQuantityMode {
    if (def.quantityMode) return def.quantityMode;
    return def.type === 'consumable' ? 'countable' : 'global';
  }
}
