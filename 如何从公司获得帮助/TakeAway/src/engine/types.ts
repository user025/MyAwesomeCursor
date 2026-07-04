/** 玩家数值属性 */
export interface PlayerStats {
  hp: number;
  maxHp: number;
  xp: number;
  charisma: number;
  caffeine: number;
  productivity: number;
  upwardManagement: number;
  hobby: number;
  indieDev: number;
}

/** 玩家完整状态 */
export interface Player {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  hp: number;
  maxHp: number;
  charisma: number;
  caffeine: number;
  productivity: number;
  upwardManagement: number;
  hobby: number;
  indieDev: number;
  inventory: InventoryItem[];
  flags: Record<string, boolean>;
  visitedScenes: string[];
  resolvedEffectChoices: string[];
  relationships: Record<string, CharacterRelationshipState>;
  chapterCheckpoint?: ChapterCheckpoint;
  time?: PlayerTimeState;
  /** 各项目已投入工时（项目 ID → 小时数） */
  projectWork?: Record<string, number>;
  /** 番外结束后要回到的结局场景 */
  pendingEndingScene?: string;
}

export interface ChapterCheckpoint {
  chapterId: string;
  sceneId: string;
  player: Player;
}

export interface CharacterRelationshipState {
  characterId: string;
  affinity: number;
  interactions: CharacterInteraction[];
}

export interface CharacterInteraction {
  sceneId?: string;
  choiceId?: string;
  summary: string;
  affinityDelta?: number;
}

export interface PlayerTimeState {
  chapterId: string;
  chapterName: string;
  startScene: string;
  enabled: boolean;
  elapsed: number;
  remaining: number;
  total: number;
  unit: string;
  defaultActionTimeCost: number;
  defaultItemTimeCost: number;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
}

export type ItemFunctionAction = 'use';
export type ItemQuantityMode = 'global' | 'countable';

/** 道具功能定义，可通过 flag 延迟解锁 */
export interface ItemFunctionDef {
  id: string;
  name: string;
  description: string;
  action?: ItemFunctionAction;
  timeCost?: number;
  unlockFlag?: string;
  lockedDescription?: string;
}

export interface ItemFunctionState extends ItemFunctionDef {
  unlocked: boolean;
  resolvedTimeCost: number;
  resolvedTimeUnit: string;
}

/** 道具定义 */
export interface ItemDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
  type: 'consumable' | 'equipment' | 'keyItem';
  quantityMode?: ItemQuantityMode;
  effects: Partial<PlayerStats>;
  functions?: ItemFunctionDef[];
}

/** 剧情选项 */
export interface Choice {
  id: string;
  text: string;
  nextScene: string;
  timeCost?: number;
  statCheck?: { stat: keyof PlayerStats; min: number; failText: string; failScene: string };
  effects?: Partial<PlayerStats>;
  /** 每次选择都会生效的属性变化（如连续加班扣健康） */
  repeatableEffects?: Partial<PlayerStats>;
  /** 与本章共享的休息恢复标记；健康恢复每章仅生效一次 */
  chapterRestFlag?: string;
  giveItem?: string;
  requireItem?: string;
  requireFlag?: string;
  /** 需全部满足的 flag 列表 */
  requireFlags?: string[];
  /** 选项因 requireFlag/requireItem 未满足时显示的提示 */
  lockedText?: string;
  setFlag?: string;
  narrative?: string;
  relationships?: ChoiceRelationshipEvent | ChoiceRelationshipEvent[];
}

export interface ChoiceRelationshipEvent {
  characterId: string;
  summary: string;
  affinityDelta?: number;
}

/** 场景定义 */
export interface Scene {
  id: string;
  chapterId?: string;
  location: string;
  title: string;
  description: string;
  choices: Choice[];
  onEnter?: string;
}

export type GamePhase = 'title' | 'playing' | 'gameOver' | 'victory';

export type LevelUpStat = 'charisma' | 'productivity' | 'hp' | 'upwardManagement' | 'hobby' | 'indieDev';

export interface ProjectDef {
  id: string;
  name: string;
  requiredHours: number;
  completeFlag: string;
  workChoiceIds: string[];
  hubSceneIds: string[];
}

export interface ActiveProjectView {
  id: string;
  name: string;
  requiredHours: number;
  spentHours: number;
  remainingHours: number;
  unit: string;
}

export interface HealthConfig {
  alertThreshold: number;
  criticalThreshold: number;
  criticalEndingScene: string;
  criticalNarrative: string;
  alertMessage: string;
}

/** 触发结局后再进入的番外配置 */
export interface ExtraAfterEndingConfig {
  sceneId: string;
  chapterId: string;
  exitSceneIds: string[];
}

/** 剧情引擎配置 */
export interface StoryConfig {
  scenes: Record<string, Scene>;
  startScene: string;
  endingPrefix?: string;
  statLabels?: Record<string, string>;
  time?: StoryTimeConfig;
  projects?: ProjectDef[];
  health?: HealthConfig;
  extraAfterEnding?: ExtraAfterEndingConfig;
}

export interface StoryTimeConfig {
  defaultChapterId: string;
  chapters: Record<string, ChapterTimeDef>;
}

export interface ChapterTimeDef {
  id: string;
  name: string;
  startScene: string;
  total: number;
  enabled?: boolean;
  timeoutScene?: string;
  timeoutText?: string;
  /** 时间用尽且持有该 flag 时视为通关，跳转 passScene */
  passFlag?: string;
  passScene?: string;
  passText?: string;
  unit?: string;
  defaultActionTimeCost?: number;
  defaultItemTimeCost?: number;
}

/** 选项解析结果 */
export interface ChoiceResult {
  player: Player;
  nextSceneId: string;
  narrative: string | null;
  logEntries: string[];
  toastEntries: string[];
  leveledUp: boolean;
  timeCost: number;
}

/** 道具使用结果 */
export interface ItemUseResult {
  player: Player;
  logEntries: string[];
  toastEntries: string[];
  timeCost: number;
  healthEnding?: { sceneId: string; narrative: string };
  timeoutTransition?: { sceneId: string; narrative: string };
}

/** 结局展示信息 */
export interface EndingInfo {
  label: string;
  className: string;
}

export interface CharacterDef {
  id: string;
  name: string;
  role?: string;
  description?: string;
  emoji?: string;
}

/** 游戏元数据（标题、结局文案等） */
export interface GameMeta {
  title: string;
  subtitle: string;
  introLog?: string;
  statLabels?: Record<string, string>;
  characters?: Record<string, CharacterDef>;
  endings?: Record<string, EndingInfo>;
}

/** 完整游戏内容包：剧情 + 道具 + 元数据 */
export interface GameContent {
  story: StoryConfig;
  items: Record<string, ItemDef>;
  meta?: GameMeta;
}
