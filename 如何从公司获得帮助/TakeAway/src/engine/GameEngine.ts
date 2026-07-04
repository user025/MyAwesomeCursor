import type { GameContent, LevelUpStat, Player } from './types';
import { createPlayer, applyLevelUp } from './player';
import { ItemEngine } from './ItemEngine';
import { StoryEngine } from './StoryEngine';

/**
 * 游戏引擎门面：组合剧情引擎与道具引擎，对外提供统一 API。
 * 通过 GameContent 注入具体故事与道具数据。
 */
export class GameEngine {
  readonly story: StoryEngine;
  readonly items: ItemEngine;
  readonly meta: GameContent['meta'];

  constructor(content: GameContent) {
    this.items = new ItemEngine(
      content.items,
      content.meta?.statLabels,
      content.story.health,
      content.story.time,
    );
    this.story = new StoryEngine(content.story, this.items);
    this.meta = content.meta;
  }

  createPlayer(name: string): Player {
    const player = createPlayer(name, this.story.createInitialTimeState());
    return {
      ...player,
      chapterCheckpoint: this.story.createCheckpoint(player, this.story.getStartSceneId()),
    };
  }

  applyLevelUp(player: Player, stat: LevelUpStat): Player {
    return applyLevelUp(player, stat);
  }
}
