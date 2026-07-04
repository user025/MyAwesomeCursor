import type { Player, StoryTimeConfig } from './types';

export interface ChapterTimeoutResult {
  sceneId: string;
  text: string;
  passed: boolean;
}

export function evaluateChapterTimeout(
  player: Player,
  timeConfig?: StoryTimeConfig,
): ChapterTimeoutResult | null {
  if (!timeConfig || !player.time?.enabled || player.time.remaining > 0) {
    return null;
  }

  const chapter = timeConfig.chapters[player.time.chapterId];
  if (!chapter) return null;

  if (chapter.passFlag && player.flags[chapter.passFlag] && chapter.passScene) {
    return {
      sceneId: chapter.passScene,
      text: chapter.passText ?? '时间用尽，但你已完成本章目标，进入下一阶段。',
      passed: true,
    };
  }

  if (chapter.timeoutScene) {
    return {
      sceneId: chapter.timeoutScene,
      text: chapter.timeoutText ?? '时间被消耗殆尽，你错过了关键窗口。',
      passed: false,
    };
  }

  return null;
}
