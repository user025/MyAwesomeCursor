import { GameEngine } from '../../engine';
import type { GameContent } from '../../engine/types';
import { SCENES, START_SCENE } from './story';
import { ITEMS } from './items';
import { megacorpMeta, megacorpTime } from './config';

export { SCENES, START_SCENE, ITEMS, megacorpMeta, megacorpTime };

/** MegaCorp 完整内容包 */
export const megacorpContent: GameContent = {
  story: {
    scenes: SCENES,
    startScene: START_SCENE,
    statLabels: megacorpMeta.statLabels,
    time: megacorpTime,
  },
  items: ITEMS,
  meta: megacorpMeta,
};

/** 创建 MegaCorp 游戏实例 */
export function createMegacorpGame(): GameEngine {
  return new GameEngine(megacorpContent);
}
