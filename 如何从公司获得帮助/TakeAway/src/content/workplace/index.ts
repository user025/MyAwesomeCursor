import { GameEngine } from '../../engine';
import type { GameContent } from '../../engine/types';
import { SCENES, START_SCENE } from './story';
import { ITEMS } from './items';
import { workplaceMeta, workplaceTime, workplaceProjects, workplaceHealth } from './config';

export const workplaceContent: GameContent = {
  story: {
    scenes: SCENES,
    startScene: START_SCENE,
    statLabels: workplaceMeta.statLabels,
    time: workplaceTime,
    projects: workplaceProjects,
    health: workplaceHealth,
    extraAfterEnding: {
      sceneId: 'extra_industry_event_start',
      chapterId: 'extra_industry_event',
      exitSceneIds: ['c6_settlement'],
    },
  },
  items: ITEMS,
  meta: workplaceMeta,
};

export function createWorkplaceGame(): GameEngine {
  return new GameEngine(workplaceContent);
}
