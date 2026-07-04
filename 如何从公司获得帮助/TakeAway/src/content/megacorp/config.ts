import type { GameMeta, StoryTimeConfig } from '../../engine/types';

export const megacorpMeta: GameMeta = {
  title: 'MEGACORP',
  subtitle: '第一天',
  introLog: '第一天开始了。你踏入 MegaCorp。',
  statLabels: {
    charisma: '魅力',
    productivity: '效率',
    caffeine: '咖啡因',
    hp: '生命',
  },
  endings: {
    ending_victory: { label: '结局：远见者——第一天就被提拔', className: 'victory' },
    ending_good: { label: '结局：新星升起', className: 'good' },
    ending_neutral: { label: '结局：又一个办公室日常', className: 'neutral' },
    ending_bad: { label: '结局：离职面谈——游戏结束', className: 'bad' },
  },
};

export const megacorpTime: StoryTimeConfig = {
  defaultChapterId: 'first_day',
  chapters: {
    first_day: {
      id: 'first_day',
      name: '第一天',
      startScene: 'lobby',
      total: 480,
      unit: '分钟',
      defaultActionTimeCost: 10,
      defaultItemTimeCost: 5,
    },
  },
};
