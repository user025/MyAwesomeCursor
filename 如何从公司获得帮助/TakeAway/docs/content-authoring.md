# 添加剧情和道具指南

本文档说明如何为游戏添加新的故事内容包。当前架构把通用逻辑放在 `src/engine/`，把具体剧情和道具放在 `src/content/<content-name>/`。

## 推荐目录结构

每个故事内容包使用独立目录：

```text
src/content/demo/
├── config.ts
├── index.ts
├── items.ts
└── story.ts
```

- `story.ts`：定义场景、选项和跳转。
- `items.ts`：定义道具。
- `config.ts`：定义标题、开场日志、属性显示名和结局横幅。
- `index.ts`：把剧情、道具和元数据组装成 `GameContent`。

## 添加道具

在 `items.ts` 中导出 `ITEMS`：

```ts
import type { ItemDef } from '../../engine/types';

export const ITEMS: Record<string, ItemDef> = {
  torch: {
    id: 'torch',
    name: '火把',
    description: '照亮前路，驱散迷雾。',
    emoji: '🔦',
    type: 'keyItem',
    quantityMode: 'global',
    effects: {},
  },

  herb: {
    id: 'herb',
    name: '疗伤草',
    description: '恢复少量生命。',
    emoji: '🌿',
    type: 'consumable',
    quantityMode: 'countable',
    effects: { hp: 20 },
    functions: [
      {
        id: 'use',
        name: '使用草药',
        description: '生命 +20。',
        action: 'use',
        timeCost: 5,
      },
      {
        id: 'brew_medicine',
        name: '调制药剂',
        description: '你已经学会把草药做成更稳定的药剂。',
        timeCost: 20,
        unlockFlag: 'learned_medicine',
        lockedDescription: '需要先向森林医师学习草药知识。',
      },
    ],
  },
};
```

### 道具字段

- `id`：道具唯一 ID。剧情中的 `giveItem` 和 `requireItem` 要引用这个值。
- `name`：显示名称。
- `description`：背包提示和日志描述。
- `emoji`：背包图标。
- `type`：道具类型。
  - `consumable`：消耗品，玩家可以点击使用。
  - `equipment`：装备类，目前只展示，不自动装备。
  - `keyItem`：关键道具，用于解锁选项。
- `quantityMode`：可选。控制背包数量规则。
  - `global`：全局唯一道具，已拥有时不会重复领取。
  - `countable`：可计数道具，重复领取会增加数量。
- `effects`：使用道具时改变的属性，仅 `consumable` 会被使用。
- `functions`：可选。道具详情弹窗中的功能列表。未配置时，引擎会给消耗品生成默认“使用”功能，给其他道具生成默认“查看”功能。

如果未声明 `quantityMode`，引擎会使用默认规则：

- `consumable` 默认为 `countable`。
- `equipment` 和 `keyItem` 默认为 `global`。

可用属性包括：

```ts
hp
maxHp
xp
charisma
caffeine
productivity
```

### 道具功能字段

`functions` 中每一项支持：

- `id`：功能唯一 ID。
- `name`：功能名称。
- `description`：功能已解锁时显示的说明。
- `action`：可选。当前支持 `use`，表示点击该功能会消耗并使用此道具。
- `timeCost`：可选。触发该功能消耗的时间。未配置时使用当前篇章的 `defaultItemTimeCost`。
- `unlockFlag`：可选。玩家拥有该 flag 时功能才解锁。
- `lockedDescription`：可选。功能未解锁时显示的提示。

示例：

```ts
functions: [
  {
    id: 'inspect',
    name: '查看',
    description: '这是一枚旧徽章，上面刻着模糊的名字。',
  },
  {
    id: 'decode',
    name: '解读隐藏文字',
    description: '你读出了徽章背面的暗号。',
    unlockFlag: 'learned_old_language',
    lockedDescription: '需要先学会古老文字。',
  },
]
```

## 添加剧情

在 `story.ts` 中导出 `START_SCENE` 和 `SCENES`：

```ts
import type { Scene } from '../../engine/types';

export const START_SCENE = 'entrance';

export const SCENES: Record<string, Scene> = {
  entrance: {
    id: 'entrance',
    location: '森林入口',
    title: '迷雾',
    description: '两条小径消失在浓雾中。左边有流水声，右边有一间木屋。',
    choices: [
      {
        id: 'go_stream',
        text: '走向溪流',
        nextScene: 'stream',
        timeCost: 10,
        narrative: '你拨开灌木，朝水声走去。',
        relationships: {
          characterId: 'forest_guard',
          summary: '向守林人问路，获得了左侧溪流的信息。',
          affinityDelta: 2,
        },
      },
      {
        id: 'go_cabin',
        text: '走向木屋',
        nextScene: 'cabin',
        timeCost: 15,
        narrative: '你踩着落叶，向木屋靠近。',
      },
    ],
  },

  stream: {
    id: 'stream',
    location: '溪流边',
    title: '草药',
    description: '溪水边长着一株散发淡淡香气的草。',
    choices: [
      {
        id: 'take_herb',
        text: '采下疗伤草',
        nextScene: 'crossroads',
        giveItem: 'herb',
        setFlag: 'found_herb',
        effects: { xp: 10 },
        narrative: '你小心地把疗伤草收进包里。',
      },
    ],
  },

  cabin: {
    id: 'cabin',
    location: '废弃木屋',
    title: '黑暗',
    description: '木屋里一片漆黑。角落似乎有什么东西。',
    choices: [
      {
        id: 'search_cabin',
        text: '摸黑搜索',
        nextScene: 'cabin_found',
        statCheck: {
          stat: 'charisma',
          min: 12,
          failText: '你被黑暗吓退，只好回到入口。',
          failScene: 'entrance',
        },
        narrative: '你深吸一口气，推门而入。',
      },
    ],
  },

  cabin_found: {
    id: 'cabin_found',
    location: '木屋内部',
    title: '火把',
    description: '角落里有一支旧火把，还能使用。',
    choices: [
      {
        id: 'take_torch',
        text: '拿起火把',
        nextScene: 'crossroads',
        giveItem: 'torch',
        narrative: '火把照亮了前路。',
      },
    ],
  },

  crossroads: {
    id: 'crossroads',
    location: '岔路口',
    title: '出口',
    description: '浓雾挡住去路。你需要找到穿过雾区的方法。',
    choices: [
      {
        id: 'use_torch_path',
        text: '举着火把穿过雾区',
        nextScene: 'ending_good',
        requireItem: 'torch',
        setFlag: 'ending_good',
        narrative: '火光驱散迷雾，你看见了出口。',
      },
      {
        id: 'push_through',
        text: '硬着头皮冲过去',
        nextScene: 'ending_good',
        requireFlag: 'found_herb',
        statCheck: {
          stat: 'hp',
          min: 50,
          failText: '雾太浓了，你迷失了方向。',
          failScene: 'ending_bad',
        },
        setFlag: 'ending_good',
        narrative: '你咬牙冲进雾中。',
      },
      {
        id: 'walk_blind',
        text: '直接走进浓雾',
        nextScene: 'ending_bad',
        narrative: '雾气吞没了你。',
      },
    ],
  },

  ending_good: {
    id: 'ending_good',
    location: '森林出口',
    title: '重见天日',
    description: '阳光洒在脸上。你走出了森林。',
    choices: [
      {
        id: 'good_final',
        text: '你平安归来。',
        nextScene: 'ending_good',
      },
    ],
  },

  ending_bad: {
    id: 'ending_bad',
    location: '迷雾深处',
    title: '迷失',
    description: '没有人知道你去了哪里。',
    choices: [
      {
        id: 'bad_final',
        text: '游戏结束。',
        nextScene: 'ending_bad',
      },
    ],
  },
};
```

## 场景字段

- `id`：场景唯一 ID。必须和 `SCENES` 的 key 保持一致。
- `location`：场景位置标签。
- `title`：场景标题。
- `description`：场景正文。
- `choices`：当前场景可选操作。
- `onEnter`：预留字段，目前引擎未处理。

## 选项字段

- `id`：选项唯一 ID。
- `text`：按钮文案。
- `nextScene`：选择后跳转的场景 ID。
- `timeCost`：可选。选择该行动消耗的时间。未配置时使用当前篇章的 `defaultActionTimeCost`。
- `narrative`：选择后显示在下一段场景上方的叙事文字。
- `effects`：选择后立即生效的属性变化。同一个选项 ID 的 `effects` 只会结算一次，避免循环聊天重复刷或重复扣属性。
- `repeatableEffects`：每次选择都会生效的属性变化，适合连续推进项目时反复扣健康等场景。
- `chapterRestFlag`：与本章共享的休息恢复标记；带健康恢复的休息选项每章仅生效一次。
- `projects`：章节项目燃尽配置，见 `ProjectDef`（`requiredHours`、`workChoiceIds`、`hubSceneIds`）。
- `health`：健康阈值配置。`alertThreshold` 以下显示警报，`criticalThreshold` 以下进入 `criticalEndingScene`。
- `statCheck`：属性检定。检定失败时跳到 `failScene`，并显示 `failText`。
- `giveItem`：给予道具。值必须存在于 `ITEMS`。
- `requireItem`：背包中有指定道具时才显示该选项。
- `requireFlag`：玩家已有指定 flag 时才显示该选项。
- `setFlag`：选择后设置一个 flag。
- `relationships`：可选。记录本次选择与人物的互动历史，可以传单个对象或对象数组。

如果某个内容包把 `charisma` 显示为“羽翼”或类似人脉资源，不要把普通寒暄、关怀或单向认识写成 `charisma` 加成。只有交换关键信息、互相帮助、建立可持续合作关系时，才应增加 `charisma`。

`charisma` 也可以扣减，例如破坏信任、公开甩锅、撕破脸、拒绝互惠或让他人承担代价。由于同一个 `choice.id` 的 `effects` 只结算一次，同一个聊天选项不会重复加减羽翼。

### 人物关系字段

在 `config.ts` 的 `GameMeta.characters` 中定义人物：

```ts
export const demoMeta: GameMeta = {
  title: '迷雾森林',
  subtitle: '第一章',
  characters: {
    forest_guard: {
      id: 'forest_guard',
      name: '守林人',
      role: '森林入口的引路人',
      description: '熟悉森林里的岔路和传说。',
      emoji: '🧭',
    },
  },
  endings: {},
};
```

在选项中记录互动：

```ts
relationships: {
  characterId: 'forest_guard',
  summary: '向守林人问路，获得了左侧溪流的信息。',
  affinityDelta: 2,
}
```

如果一个选项同时影响多个人物，可以传数组：

```ts
relationships: [
  {
    characterId: 'mentor',
    summary: '接受导师安排的任务。',
    affinityDelta: 3,
  },
  {
    characterId: 'rival',
    summary: '抢走竞争者原本想负责的任务。',
    affinityDelta: -5,
  },
]
```

人物关系会记录到玩家状态里，并在侧边栏的「人物关系」面板展示累计关系值和最近互动历史。

## 添加元数据

在 `config.ts` 中定义标题、日志、属性名和结局横幅：

```ts
import type { GameMeta } from '../../engine/types';

export const demoMeta: GameMeta = {
  title: '迷雾森林',
  subtitle: '第一章',
  introLog: '你站在森林入口，雾气弥漫。',
  statLabels: {
    charisma: '魅力',
    productivity: '效率',
    caffeine: '咖啡因',
    hp: '生命',
  },
  endings: {
    ending_good: { label: '结局：平安归来', className: 'good' },
    ending_bad: { label: '结局：迷失在雾中', className: 'bad' },
  },
};
```

结局场景默认通过 `ending_` 前缀识别。`endings` 的 key 通常与结局场景 ID 或结局 flag 保持一致。

## 添加篇章时间

每个内容包可以在 `config.ts` 中定义篇章时间。玩家开始游戏时会进入 `defaultChapterId`，行动选项和可使用道具会扣除对应时间。

```ts
import type { GameMeta, StoryTimeConfig } from '../../engine/types';

export const demoTime: StoryTimeConfig = {
  defaultChapterId: 'chapter_1',
  chapters: {
    chapter_1: {
      id: 'chapter_1',
      name: '第一章：迷雾森林',
      startScene: 'entrance',
      total: 180,
      enabled: false,
      unit: '分钟',
      defaultActionTimeCost: 10,
      defaultItemTimeCost: 5,
    },
    chapter_2: {
      id: 'chapter_2',
      name: '第二章：山中小屋',
      startScene: 'mountain_cabin',
      total: 120,
      enabled: true,
      timeoutScene: 'ending_bad',
      timeoutText: '时间被消耗殆尽，你错过了关键窗口。',
      unit: '分钟',
      defaultActionTimeCost: 8,
      defaultItemTimeCost: 3,
    },
  },
};
```

如果某个场景属于另一个篇章，可以在场景上声明 `chapterId`。进入该场景时，引擎会切换到对应篇章并重置该篇章时间。

```ts
mountain_cabin: {
  id: 'mountain_cabin',
  chapterId: 'chapter_2',
  location: '山中小屋',
  title: '新的篇章',
  description: '你抵达了小屋。',
  choices: [],
}
```

时间字段说明：

- `total`：该篇章总时间。
- `startScene`：该篇章起点场景。进入坏结局后，玩家点击“回到当前章节”会回到这个场景。
- `enabled`：可选。是否启用时间扣减，默认 `true`。设为 `false` 时，该篇章不显示时间条，选项和道具使用也不会扣时间。
- `timeoutScene`：可选。启用时间后，剩余时间扣到 0 且未通关时跳转的失败场景。
- `timeoutText`：可选。时间耗尽且未通关时显示的叙事文字。
- `passFlag` / `passScene` / `passText`：可选。时间用尽时若持有 `passFlag`，视为本章通关并跳转 `passScene`。
- `unit`：显示单位，默认 `分钟`。
- `defaultActionTimeCost`：选项未声明 `timeCost` 时使用的默认行动耗时。
- `defaultItemTimeCost`：道具功能未声明 `timeCost` 时使用的默认道具耗时。
- `Choice.timeCost`：覆盖单个行动选项的耗时。
- `ItemFunctionDef.timeCost`：覆盖单个道具功能的耗时。

启用时间的章节中，每次选项或道具使用扣除时间时，界面会弹出 toast 提示。项目推进章节应给工作、休息、闲聊都配置明确耗时，并配置 `timeoutScene`，避免玩家无限消耗在休息区和闲聊里。

## 组装内容包

在 `index.ts` 中把剧情、道具和元数据组装成 `GameContent`：

```ts
import { GameEngine } from '../../engine';
import type { GameContent } from '../../engine/types';
import { SCENES, START_SCENE } from './story';
import { ITEMS } from './items';
import { demoMeta, demoTime } from './config';

export const demoContent: GameContent = {
  story: {
    scenes: SCENES,
    startScene: START_SCENE,
    statLabels: demoMeta.statLabels,
    time: demoTime,
  },
  items: ITEMS,
  meta: demoMeta,
};

export function createDemoGame(): GameEngine {
  return new GameEngine(demoContent);
}
```

## 接入应用

在 `src/App.tsx` 中切换游戏内容包：

```ts
import { Game } from './components/Game';
import { createDemoGame } from './content/demo';
import './App.css';

const game = createDemoGame();

function App() {
  return <Game engine={game} />;
}

export default App;
```

## 校验建议

添加或修改内容后，至少运行：

```sh
npm run build
npm run lint
```

如果新增了复杂分支，建议手动检查这些路径：

- 起点能进入目标场景。
- 每个 `nextScene` 都存在。
- 每个 `giveItem` / `requireItem` 都存在于 `ITEMS`。
- 需要隐藏的选项确实被 `requireItem` 或 `requireFlag` 控制。
- 结局场景 ID 使用 `ending_` 前缀。
