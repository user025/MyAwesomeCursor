import type { ChapterTimeDef, LevelUpStat, Player, PlayerTimeState } from './types';

export function createPlayer(name: string, time?: PlayerTimeState): Player {
  return {
    name,
    level: 1,
    xp: 0,
    xpToNext: 100,
    hp: 100,
    maxHp: 100,
    charisma: 10,
    caffeine: 0,
    productivity: 10,
    upwardManagement: 0,
    hobby: 0,
    indieDev: 0,
    inventory: [],
    flags: {},
    visitedScenes: [],
    resolvedEffectChoices: [],
    relationships: {},
    chapterCheckpoint: undefined,
    time,
    projectWork: {},
  };
}

export function createChapterTimeState(chapter: ChapterTimeDef): PlayerTimeState {
  return {
    chapterId: chapter.id,
    chapterName: chapter.name,
    startScene: chapter.startScene,
    enabled: chapter.enabled ?? true,
    elapsed: 0,
    remaining: chapter.total,
    total: chapter.total,
    unit: chapter.unit ?? '分钟',
    defaultActionTimeCost: chapter.defaultActionTimeCost ?? 10,
    defaultItemTimeCost: chapter.defaultItemTimeCost ?? 5,
  };
}

export function calculateXpToNext(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export type StatKeys = 'hp' | 'maxHp' | 'charisma' | 'caffeine' | 'productivity' | 'upwardManagement' | 'hobby' | 'indieDev' | 'xp';

export function addXp(player: Player, amount: number): { player: Player; leveledUp: boolean } {
  let p = { ...player, xp: player.xp + amount };
  let leveledUp = false;
  while (p.xp >= p.xpToNext) {
    p = { ...p, level: p.level + 1, xp: p.xp - p.xpToNext };
    p.xpToNext = calculateXpToNext(p.level);
    p.maxHp += 15;
    p.hp = Math.min(p.hp + 15, p.maxHp);
    leveledUp = true;
  }
  return { player: p, leveledUp };
}

export function applyEffects(player: Player, effects: Partial<Record<StatKeys, number>>): Player {
  let p = { ...player };
  if (effects.hp) p.hp = Math.max(0, Math.min(p.hp + effects.hp, p.maxHp));
  if (effects.maxHp) p.maxHp = Math.max(p.maxHp, p.maxHp + effects.maxHp);
  if (effects.charisma) p.charisma = Math.max(0, p.charisma + effects.charisma);
  if (effects.caffeine) p.caffeine = Math.max(0, p.caffeine + effects.caffeine);
  if (effects.productivity) p.productivity = Math.max(0, p.productivity + effects.productivity);
  if (effects.upwardManagement) p.upwardManagement = Math.max(0, p.upwardManagement + effects.upwardManagement);
  if (effects.hobby) p.hobby = Math.max(0, p.hobby + effects.hobby);
  if (effects.indieDev) p.indieDev = Math.max(0, p.indieDev + effects.indieDev);
  if (effects.xp) {
    const result = addXp(p, effects.xp);
    p = result.player;
  }
  return p;
}

export function applyLevelUp(player: Player, stat: LevelUpStat): Player {
  const newLevel = player.level + 1;
  const newMaxHp = player.maxHp + 15;
  return {
    ...player,
    level: newLevel,
    xp: player.xp - player.xpToNext,
    xpToNext: calculateXpToNext(newLevel),
    maxHp: newMaxHp,
    hp: Math.min(player.hp + 15, newMaxHp),
    charisma: stat === 'charisma' ? player.charisma + 5 : player.charisma,
    productivity: stat === 'productivity' ? player.productivity + 5 : player.productivity,
    upwardManagement: stat === 'upwardManagement' ? player.upwardManagement + 5 : player.upwardManagement,
    hobby: stat === 'hobby' ? player.hobby + 5 : player.hobby,
    indieDev: stat === 'indieDev' ? player.indieDev + 5 : player.indieDev,
  };
}

export function spendTime(player: Player, amount: number): Player {
  if (!player.time || !player.time.enabled || amount <= 0) return player;

  const elapsed = player.time.elapsed + amount;
  const remaining = Math.max(0, player.time.remaining - amount);
  return {
    ...player,
    time: {
      ...player.time,
      elapsed,
      remaining,
    },
  };
}

export function hasItem(player: Player, itemId: string): boolean {
  return player.inventory.some(i => i.itemId === itemId);
}

export function addItem(player: Player, itemId: string): Player {
  const existing = player.inventory.find(i => i.itemId === itemId);
  if (existing) {
    return {
      ...player,
      inventory: player.inventory.map(i =>
        i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i
      ),
    };
  }
  return {
    ...player,
    inventory: [...player.inventory, { itemId, quantity: 1 }],
  };
}

export function removeItem(player: Player, itemId: string): Player {
  return {
    ...player,
    inventory: player.inventory
      .map(i => i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i)
      .filter(i => i.quantity > 0),
  };
}

export function hasVisited(player: Player, sceneId: string): boolean {
  return player.visitedScenes.includes(sceneId);
}
