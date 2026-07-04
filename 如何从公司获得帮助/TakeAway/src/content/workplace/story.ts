import type { Scene } from '../../engine/types';

export const START_SCENE = 'onboarding';

export const SCENES: Record<string, Scene> = {
  // ================= 第一章 =================
  onboarding: {
    id: 'onboarding',
    chapterId: 'chapter_1',
    location: 'HR 办公室',
    title: '入职第一天',
    description: 'HR 递给你一台崭新的 Mac 和一张印着你名字的工牌。同时，她意味深长地提醒你：“在公司里，有些红线是绝对不能碰的。”',
    choices: [
      {
        id: 'take_equipments',
        text: '接过 Mac',
        nextScene: 'take_badge',
        giveItem: 'mac',
        setFlag: 'has_mac',
        narrative: '你接过公司配发的 Mac，沉甸甸的铝合金机身像一份还没开始的 KPI。',
        relationships: {
          characterId: 'hr_sister',
          summary: '入职时听取 HR 关于公司红线的提醒。',
          affinityDelta: 1,
        },
      },
    ],
  },

  take_badge: {
    id: 'take_badge',
    chapterId: 'chapter_1',
    location: 'HR 办公室',
    title: '身份凭证',
    description: 'HR 又递来一张印着你名字和公司 Logo 的工牌。“这张卡能进门、吃饭、参加公司合作的行业活动。也提醒你，出了门你代表的还是公司。”',
    choices: [
      {
        id: 'take_badge_item',
        text: '挂上工牌，前往工位',
        nextScene: 'office_hub',
        giveItem: 'badge',
        setFlag: 'has_badge',
        narrative: '你把工牌挂在脖子上，抱着 Mac 走向了你的工位。',
      },
    ],
  },

  office_hub: {
    id: 'office_hub',
    location: '你的工位',
    title: '办公室探索',
    description: '你坐在工位上，环顾四周。你可以去茶水间找点吃的，或者在办公室里转转，认识一下新同事。',
    choices: [
      {
        id: 'go_pantry',
        text: '去茶水间 (耗时1小时)',
        nextScene: 'pantry',
        timeCost: 1,
        narrative: '你起身走向了茶水间。',
      },
      {
        id: 'go_chat',
        text: '找同事闲聊 (耗时1小时)',
        nextScene: 'chat_colleagues',
        timeCost: 1,
        narrative: '你决定去认识一下周围的同事。',
      },
      {
        id: 'start_chapter2',
        text: '【进入第二章】开始接手项目',
        nextScene: 'chapter2_start',
        requireFlag: 'chatted_with_colleagues',
        narrative: '熟悉了环境后，主管把你叫到了办公室。',
      },
    ],
  },

  pantry: {
    id: 'pantry',
    location: '茶水间',
    title: '能量补给',
    description: '茶水间里有各种零食和饮料。你要来点什么？',
    choices: [
      {
        id: 'take_snack',
        text: '吃点高糖零食',
        nextScene: 'office_hub',
        effects: { hp: -5, productivity: 5 },
        narrative: '糖分让你短暂地充满了力量。',
      },
      {
        id: 'take_coffee',
        text: '来杯冰美式',
        nextScene: 'office_hub',
        effects: { productivity: 10 },
        narrative: '苦涩的咖啡因唤醒了你的大脑。',
      },
      {
        id: 'take_water',
        text: '喝杯温开水',
        nextScene: 'office_hub',
        effects: { hp: 8 },
        chapterRestFlag: 'chapter_1_rest_used',
        narrative: '温水下肚，感觉整个人都舒服了一些。',
      },
      {
        id: 'back_to_desk',
        text: '返回工位',
        nextScene: 'office_hub',
        effects: { hp: 4 },
        chapterRestFlag: 'chapter_1_rest_used',
        narrative: '你在茶水间发了一会儿呆，感觉好了一些。',
      },
    ],
  },

  chat_colleagues: {
    id: 'chat_colleagues',
    location: '办公区',
    title: '跨部门社交',
    description: '你在走廊上遇到了其他部门的同事。你可以选择和谁聊聊：',
    choices: [
      {
        id: 'chat_hr',
        text: '和 HR 姐姐聊聊',
        nextScene: 'office_hub',
        setFlag: 'chatted_with_colleagues',
        narrative: 'HR 姐姐很关心你适不适应新环境，并提醒你注意身体。',
        relationships: {
          characterId: 'hr_sister',
          summary: '入职初期和 HR 姐姐聊天，感受到了人文关怀。',
          affinityDelta: 5,
        },
      },
      {
        id: 'chat_sales',
        text: '和销售哥聊聊',
        nextScene: 'office_hub',
        effects: { charisma: 5 },
        setFlag: 'chatted_with_colleagues',
        narrative: '销售哥神秘兮兮地说：“最近外面有人找我们跑数据、做付费咨询，甚至还有供应商给回扣。千万别碰，这都是公司红线，刚开除了一批人！”',
        relationships: {
          characterId: 'sales_bro',
          summary: '从销售哥那里听到了关于公司红线的八卦。',
          affinityDelta: 5,
        },
      },
      {
        id: 'chat_project_manager',
        text: '和项目经理聊聊',
        nextScene: 'office_hub',
        setFlag: 'chatted_with_colleagues',
        narrative: '项目经理一开口就是 DAU、留存和转化率。他说：“技术最终要服务业务，别只看系统多优雅，关键是能不能把指标拉起来。”',
        relationships: {
          characterId: 'project_manager',
          summary: '第一次和项目经理交流，他不断强调业务指标和增长压力。',
          affinityDelta: 5,
        },
      },
    ],
  },

  // ================= 第二章 =================
  chapter2_start: {
    id: 'chapter2_start',
    chapterId: 'chapter_2',
    location: '主管办公室',
    title: '接手项目',
    description: '主管把你叫到办公室：“小伙子，准备好迎接挑战了吗？我们现在的系统并发上不去，你觉得瓶颈通常在哪？”',
    choices: [
      {
        id: 'q1_db',
        text: '通常在数据库 I/O 层面',
        nextScene: 'boss_question_2',
        timeCost: 0,
        effects: { productivity: 5, upwardManagement: 5 },
        setFlag: 'chapter2_started',
        narrative: '主管点了点头：“不错，基本功还算扎实。”',
        relationships: {
          characterId: 'boss',
          summary: '在并发瓶颈问题上给出扎实判断，获得主管初步认可。',
          affinityDelta: 5,
        },
      },
      {
        id: 'q1_fe',
        text: '肯定是前端渲染太慢了',
        nextScene: 'boss_question_2',
        timeCost: 0,
        effects: { upwardManagement: -5 },
        setFlag: 'chapter2_started',
        narrative: '主管皱了皱眉：“你确定？再回去补补课吧。”',
        relationships: {
          characterId: 'boss',
          summary: '在技术判断上答偏，主管对你的基本功产生疑虑。',
          affinityDelta: -5,
        },
      }
    ]
  },

  boss_question_2: {
    id: 'boss_question_2',
    location: '主管办公室',
    title: '架构拷问',
    description: '主管接着问：“如果要对现有单体架构进行改造，你倾向于哪种方案？”',
    choices: [
      {
        id: 'q2_micro',
        text: '逐步拆分为微服务，平滑过渡',
        nextScene: 'chapter2_hub',
        timeCost: 0,
        effects: { productivity: 5, upwardManagement: 5 },
        narrative: '主管露出赞赏的眼神：“很好，这个项目交给你我放心了。”',
        relationships: {
          characterId: 'boss',
          summary: '提出平滑拆分微服务的方案，主管放心把项目交给你。',
          affinityDelta: 8,
        },
      },
      {
        id: 'q2_rewrite',
        text: '全部推翻，用最新的语言重写！',
        nextScene: 'chapter2_hub',
        timeCost: 0,
        effects: { upwardManagement: -10 },
        narrative: '主管叹了口气：“年轻人还是太冲动，先从修 Bug 开始吧。”',
        relationships: {
          characterId: 'boss',
          summary: '主张推翻重写，主管认为你太冲动。',
          affinityDelta: -8,
        },
      }
    ]
  },

  chapter2_hub: {
    id: 'chapter2_hub',
    location: '你的工位',
    title: '项目攻坚',
    description: '你回到了工位，打开了 Mac。本章目标：累计投入 16 小时完成项目（见右上角燃尽图）。每次推进耗时 4 小时，连续推进会持续消耗健康。',
    choices: [
      {
        id: 'work_on_project',
        text: '推进项目进度（本章目标，耗时4小时）',
        nextScene: 'chapter2_hub',
        timeCost: 4,
        effects: { productivity: 10 },
        repeatableEffects: { hp: -5 },
        narrative: '你埋头写代码，项目取得了重大进展！Mac 的高级功能解锁了。',
      },
      {
        id: 'go_pantry_c2',
        text: '去茶水间休息 (耗时1小时)',
        nextScene: 'pantry_c2',
        timeCost: 1,
        narrative: '你起身走向了茶水间。',
      },
      {
        id: 'go_chat_c2',
        text: '找同事闲聊 (耗时1小时)',
        nextScene: 'chat_colleagues_c2',
        timeCost: 1,
        narrative: '你决定去放松一下大脑。',
      },
      {
        id: 'start_chapter3',
        text: '【进入第三章】有人找你谈合作',
        nextScene: 'chapter3_start',
        requireFlag: 'project_advanced',
        lockedText: '需先完成项目推进',
        narrative: '你的项目做出了点名堂，其他部门的人开始注意到你了。',
      },
    ],
  },

  pantry_c2: {
    id: 'pantry_c2',
    location: '茶水间',
    title: '能量补给',
    description: '茶水间里有各种零食和饮料。你要来点什么？',
    choices: [
      {
        id: 'take_snack_c2',
        text: '吃点高糖零食',
        nextScene: 'chapter2_hub',
        timeCost: 0,
        effects: { hp: -5, productivity: 5 },
        narrative: '糖分让你短暂地充满了力量。',
      },
      {
        id: 'take_coffee_c2',
        text: '来杯冰美式',
        nextScene: 'chapter2_hub',
        timeCost: 0,
        effects: { productivity: 10 },
        narrative: '苦涩的咖啡因唤醒了你的大脑。',
      },
      {
        id: 'take_water_c2',
        text: '喝杯温开水',
        nextScene: 'chapter2_hub',
        timeCost: 0,
        effects: { hp: 8 },
        chapterRestFlag: 'chapter_2_rest_used',
        narrative: '温水下肚，感觉整个人都舒服了一些。',
      },
      {
        id: 'back_to_desk_c2',
        text: '返回工位',
        nextScene: 'chapter2_hub',
        timeCost: 0,
        effects: { hp: 4 },
        chapterRestFlag: 'chapter_2_rest_used',
        narrative: '你在茶水间发了一会儿呆，感觉好了一些。',
      },
    ],
  },

  chat_colleagues_c2: {
    id: 'chat_colleagues_c2',
    location: '办公区',
    title: '跨部门社交',
    description: '你和同事们聊了聊最近的项目进展。你要去找谁？',
    choices: [
      {
        id: 'chat_hr_c2',
        text: '找 HR 姐姐聊聊',
        nextScene: 'chapter2_hub',
        timeCost: 0,
        narrative: 'HR 姐姐夸你最近项目做得不错，提醒你注意劳逸结合。',
        relationships: {
          characterId: 'hr_sister',
          summary: '项目期间和 HR 姐姐交流，她对你的工作状态表示肯定。',
          affinityDelta: 5,
        },
      },
      {
        id: 'chat_sales_c2',
        text: '找销售哥聊聊',
        nextScene: 'chapter2_hub',
        timeCost: 0,
        effects: { charisma: 5 },
        narrative: '销售哥再次提醒你：“最近又有猎头在领英上找人做违规咨询了，大家小心点。”',
        relationships: {
          characterId: 'sales_bro',
          summary: '再次从销售哥那里听到猎头违规咨询的风险。',
          affinityDelta: 5,
        },
      },
      {
        id: 'chat_project_manager_c2',
        text: '找项目经理交换业务信息',
        nextScene: 'chapter2_hub',
        timeCost: 0,
        effects: { charisma: 5 },
        setFlag: 'met_project_manager',
        narrative: '项目经理拿着一张漏斗图，说最近业务增长遇到瓶颈，技术团队应该“更主动地为转化负责”。你隐约觉得这句话以后还会出现。',
        relationships: {
          characterId: 'project_manager',
          summary: '项目经理向你展示业务漏斗，开始把增长压力传导给技术侧。',
          affinityDelta: 5,
        },
      },
    ],
  },

  // ================= 第三章 =================
  chapter3_start: {
    id: 'chapter3_start',
    chapterId: 'chapter_3',
    location: '会议室',
    title: '跨部门合作',
    description: '随着你在公司名气渐长，几位其他部门的同事主动找上门来，希望你能接手他们的项目。你回想起之前闲聊时听到的八卦，必须谨慎选择。',
    choices: [
      {
        id: 'c3_redline_1',
        text: '接手“外部数据调研” (事成有辛苦费)',
        nextScene: 'ending_bad_redline',
        narrative: '你以为这只是一次普通的数据导出...',
      },
      {
        id: 'c3_redline_2',
        text: '参加“行业专家电话会” (按小时付费)',
        nextScene: 'ending_bad_redline',
        narrative: '你以为这只是一次普通的行业交流...',
      },
      {
        id: 'c3_redline_3',
        text: '指定“特定供应商采购” (有回扣)',
        nextScene: 'ending_bad_redline',
        narrative: '你以为这只是一次普通的采购流程...',
      },
      {
        id: 'c3_harmful_growth_project',
        text: '接手项目经理的“激进增长实验”',
        nextScene: 'ending_bad_redline',
        narrative: '项目经理把方案说得很漂亮：绕开部分风控、默认勾选高价服务、用灰度实验快速拉高转化。你以为这只是一次业务创新，直到投诉和监管函一起到来...',
        relationships: {
          characterId: 'project_manager',
          summary: '项目经理提出激进增长实验，诱导你上线会损害用户和公司的方案。',
          affinityDelta: -10,
        },
      },
      {
        id: 'c3_good_project',
        text: '联合开发“内部提效工具”',
        nextScene: 'chapter3_hub',
        effects: { productivity: 10, charisma: 10 },
        setFlag: 'chapter3_started',
        narrative: '你拒绝了所有看似诱人的陷阱，选择了一个踏实的项目。',
        relationships: {
          characterId: 'sales_bro',
          summary: '拒绝了销售哥介绍的违规合作，选择合规的内部提效项目。',
          affinityDelta: -5,
        },
      }
    ]
  },

  chapter3_hub: {
    id: 'chapter3_hub',
    location: '你的工位',
    title: '多元发展',
    description: '你接手了合规的联合项目。本章目标：累计投入 20 小时完成联合项目（见右上角燃尽图）。同时，你发现公司的会议室经常空着。',
    choices: [
      {
        id: 'work_on_c3_project',
        text: '推进联合项目 (耗时4小时)',
        nextScene: 'chapter3_hub',
        timeCost: 4,
        effects: { productivity: 10, charisma: 5 },
        repeatableEffects: { hp: -5 },
        narrative: '跨部门合作虽然沟通成本高，但你的影响力也在提升。',
      },
      {
        id: 'go_meeting_room',
        text: '去会议室摸鱼培养爱好 (耗时1小时)',
        nextScene: 'chapter3_hub',
        timeCost: 1,
        effects: { hobby: 10, hp: 8 },
        chapterRestFlag: 'chapter_3_rest_used',
        narrative: '你躲在会议室里，享受着属于自己的静谧时光。',
      },
      {
        id: 'work_indie_dev_c3',
        text: '用电脑研究独立开发 (耗时2小时)',
        nextScene: 'chapter3_hub',
        timeCost: 2,
        requireFlag: 'chapter3_started',
        lockedText: '需先在 Mac 上解锁独立开发',
        effects: { indieDev: 8 },
        repeatableEffects: { hp: -2 },
        narrative: '你把工牌翻面扣在桌上，打开 Xcode。屏幕上的 App 原型又多了几个能跑通的页面。',
      },
      {
        id: 'go_pantry_c3',
        text: '去茶水间休息 (耗时1小时)',
        nextScene: 'pantry_c3',
        timeCost: 1,
        narrative: '你起身走向了茶水间。',
      },
      {
        id: 'go_chat_c3',
        text: '找同事闲聊 (耗时1小时)',
        nextScene: 'chat_colleagues_c3',
        timeCost: 1,
        narrative: '你决定去放松一下大脑。',
      },
      {
        id: 'start_chapter4',
        text: '【进入第四章】迎接新员工',
        nextScene: 'chapter4_start',
        requireFlag: 'c3_project_advanced',
        lockedText: '需先完成联合项目',
        narrative: '时间飞逝，你已经成为了团队里的老员工。',
      },
    ],
  },

  pantry_c3: {
    id: 'pantry_c3',
    location: '茶水间',
    title: '能量补给',
    description: '茶水间里有各种零食和饮料。你要来点什么？',
    choices: [
      {
        id: 'take_snack_c3',
        text: '吃点高糖零食',
        nextScene: 'chapter3_hub',
        timeCost: 0,
        effects: { hp: -5, productivity: 5 },
        narrative: '糖分让你短暂地充满了力量。',
      },
      {
        id: 'take_coffee_c3',
        text: '来杯冰美式',
        nextScene: 'chapter3_hub',
        timeCost: 0,
        effects: { productivity: 10 },
        narrative: '苦涩的咖啡因唤醒了你的大脑。',
      },
      {
        id: 'take_water_c3',
        text: '喝杯温开水',
        nextScene: 'chapter3_hub',
        timeCost: 0,
        effects: { hp: 8 },
        chapterRestFlag: 'chapter_3_rest_used',
        narrative: '温水下肚，感觉整个人都舒服了一些。',
      },
      {
        id: 'back_to_desk_c3',
        text: '返回工位',
        nextScene: 'chapter3_hub',
        timeCost: 0,
        effects: { hp: 4 },
        chapterRestFlag: 'chapter_3_rest_used',
        narrative: '你在茶水间发了一会儿呆，感觉好了一些。',
      },
    ],
  },

  chat_colleagues_c3: {
    id: 'chat_colleagues_c3',
    location: '办公区',
    title: '跨部门社交',
    description: '联合项目推进中，同事们各有消息。你要去找谁？',
    choices: [
      {
        id: 'chat_hr_c3',
        text: '找 HR 姐姐聊聊',
        nextScene: 'chapter3_hub',
        timeCost: 0,
        narrative: 'HR 姐姐提醒你跨部门协作也要注意边界，别替别的团队背锅。',
        relationships: {
          characterId: 'hr_sister',
          summary: '联合项目期间和 HR 姐姐交流，她提醒注意协作边界。',
          affinityDelta: 5,
        },
      },
      {
        id: 'chat_sales_c3',
        text: '找销售哥聊聊',
        nextScene: 'chapter3_hub',
        timeCost: 0,
        effects: { charisma: 5 },
        narrative: '销售哥说最近又有部门想“外包”违规数据合作，让你千万别沾。',
        relationships: {
          characterId: 'sales_bro',
          summary: '联合项目期间再次听到违规合作的风险提示。',
          affinityDelta: 5,
        },
      },
      {
        id: 'chat_project_manager_c3',
        text: '找项目经理交换业务信息',
        nextScene: 'chapter3_hub',
        timeCost: 0,
        effects: { charisma: 5 },
        narrative: '项目经理又拿出转化漏斗，暗示联合项目也要为增长指标服务。',
        relationships: {
          characterId: 'project_manager',
          summary: '联合项目期间项目经理继续施压业务指标。',
          affinityDelta: 3,
        },
      },
    ],
  },

  ending_bad_redline: {
    id: 'ending_bad_redline',
    location: 'HR 办公室',
    title: '触碰红线',
    description: 'HR 递给你一份解除劳动合同通知书：“公司对倒卖数据、违规咨询和职务侵占是零容忍的。请你今天之内办完离职手续。”',
    choices: [
      {
        id: 'game_over_redline',
        text: '黯然离开',
        nextScene: 'ending_bad_redline',
        timeCost: 0,
      },
    ],
  },
  // ================= 第四章 =================
  chapter4_start: {
    id: 'chapter4_start',
    chapterId: 'chapter_4',
    location: '主管办公室',
    title: '带新人',
    description: '主管把你叫到办公室：“你现在也是团队里的骨干了，今年分给你两个新人：小王是个技术宅，做事冲动；小李嘴巴甜，很会来事。记住，既要保证产出，也要关注新人的成长。”',
    choices: [
      {
        id: 'accept_mentorship',
        text: '接下带新人的任务',
        nextScene: 'c4_conflict_1',
        setFlag: 'chapter4_started',
        narrative: '你带着小王和小李回到了工位，开始给他们分配任务。',
        relationships: [
          {
            characterId: 'boss',
            summary: '接下主管安排的带新人任务。',
            affinityDelta: 3,
          },
          {
            characterId: 'newbie_wang',
            summary: '开始担任小王的导师。',
            affinityDelta: 1,
          },
          {
            characterId: 'newbie_li',
            summary: '开始担任小李的导师。',
            affinityDelta: 1,
          },
        ],
      }
    ]
  },

  c4_conflict_1: {
    id: 'c4_conflict_1',
    location: '你的工位',
    title: '线上事故 (小王)',
    description: '新人小王在未经充分测试的情况下，把一段有 Bug 的代码合并到了主分支，导致线上系统短暂崩溃。主管在群里大发雷霆，问是谁干的。',
    choices: [
      {
        id: 'c4_protect_1',
        text: '主动背锅：“是我 Review 不仔细，我来修复。”',
        nextScene: 'c4_conflict_2',
        effects: { upwardManagement: -10, charisma: 10 },
        narrative: '小王红着脸向你道谢，暗暗发誓要提升技术。但主管对你的专业度产生了怀疑。',
        relationships: [
          {
            characterId: 'newbie_wang',
            summary: '线上事故后主动替小王承担 Review 责任，小王很感激。',
            affinityDelta: 10,
          },
          {
            characterId: 'boss',
            summary: '替小王背锅后，主管对你的专业度产生怀疑。',
            affinityDelta: -8,
          },
        ],
      },
      {
        id: 'c4_blame_1',
        text: '如实汇报：“是小王合的代码，我已经让他回滚了。”',
        nextScene: 'c4_conflict_2',
        effects: { upwardManagement: 5, charisma: -10 },
        narrative: '小王低着头一言不发，默默收拾东西准备下班，团队气氛降至冰点。主管则点了点头。',
        relationships: [
          {
            characterId: 'newbie_wang',
            summary: '线上事故后如实指出是小王合入问题代码，小王受到打击。',
            affinityDelta: -10,
          },
          {
            characterId: 'boss',
            summary: '如实汇报事故责任，主管认可你的边界感。',
            affinityDelta: 5,
          },
        ],
      }
    ]
  },

  c4_conflict_2: {
    id: 'c4_conflict_2',
    location: '会议室',
    title: '季度汇报 (小李)',
    description: '季度汇报上，新人小李负责的模块进度严重滞后。但他却做了一份精美的 PPT，在主管面前大谈“底层逻辑”和“赋能”，并隐晦地暗示是你给的架构太复杂导致他无法施展。',
    choices: [
      {
        id: 'c4_protect_2',
        text: '顾全大局揽责：“是我前期没带好他，进度我来补。”',
        nextScene: 'ending_bad_backstab',
        narrative: '小李嘴角闪过一丝不易察觉的冷笑...',
        relationships: {
          characterId: 'newbie_li',
          summary: '季度汇报中替小李揽责，被小李利用为后续背刺的把柄。',
          affinityDelta: -12,
        },
      },
      {
        id: 'c4_blame_2',
        text: '当场对线：“架构文档写得很清楚，你连基本接口都没调通，别扯底层逻辑。”',
        nextScene: 'c4_hub',
        effects: { upwardManagement: 10, charisma: -5 },
        narrative: '小李被怼得哑口无言，脸色铁青。主管看出了他的虚伪，对你的雷厉风行表示赞赏。',
        relationships: [
          {
            characterId: 'newbie_li',
            summary: '当场拆穿小李甩锅，双方关系降至冰点。',
            affinityDelta: -12,
          },
          {
            characterId: 'boss',
            summary: '主管看出小李的问题，对你的雷厉风行表示赞赏。',
            affinityDelta: 8,
          },
        ],
      }
    ]
  },

  c4_hub: {
    id: 'c4_hub',
    location: '你的工位',
    title: '夹心饼干',
    description: '带新人的日子让你心力交瘁，你深刻体会到了做中层管理者的不易。',
    choices: [
      {
        id: 'work_on_c4_project',
        text: '自己加班补进度 (耗时4小时)',
        nextScene: 'c4_hub',
        timeCost: 4,
        effects: { productivity: 10 },
        repeatableEffects: { hp: -10 },
        narrative: '为了弥补新人的产出缺口，你只能牺牲自己的健康。',
      },
      {
        id: 'go_meeting_room_c4',
        text: '去会议室躲清静 (耗时1小时)',
        nextScene: 'c4_hub',
        timeCost: 1,
        effects: { hobby: 10, hp: 8 },
        chapterRestFlag: 'chapter_4_rest_used',
        narrative: '只有在这里，你才能找回片刻的宁静。',
      },
      {
        id: 'work_indie_dev_c4',
        text: '用电脑研究独立开发 (耗时2小时)',
        nextScene: 'c4_hub',
        timeCost: 2,
        requireFlag: 'chapter3_started',
        lockedText: '需先在 Mac 上解锁独立开发',
        effects: { indieDev: 8 },
        repeatableEffects: { hp: -2 },
        narrative: '趁新人还在扯皮，你戴上耳机，把副业项目的核心流程又推进了一版。',
      },
      {
        id: 'go_pantry_c4',
        text: '去茶水间休息 (耗时1小时)',
        nextScene: 'pantry_c4',
        timeCost: 1,
        narrative: '你起身走向了茶水间。',
      },
      {
        id: 'go_chat_c4',
        text: '找同事闲聊 (耗时1小时)',
        nextScene: 'chat_colleagues_c4',
        timeCost: 1,
        narrative: '你决定去放松一下大脑。',
      },
      {
        id: 'start_chapter5',
        text: '【进入第五章】年终盘点',
        nextScene: 'chapter5_check',
        requireFlag: 'c4_project_advanced',
        lockedText: '需先完成补进度',
        narrative: '转眼间，公司迎来了年底的绩效季。',
      },
    ],
  },

  pantry_c4: {
    id: 'pantry_c4',
    location: '茶水间',
    title: '能量补给',
    description: '茶水间里有各种零食和饮料。你要来点什么？',
    choices: [
      {
        id: 'take_snack_c4',
        text: '吃点高糖零食',
        nextScene: 'c4_hub',
        timeCost: 0,
        effects: { hp: -5, productivity: 5 },
        narrative: '糖分让你短暂地充满了力量。',
      },
      {
        id: 'take_coffee_c4',
        text: '来杯冰美式',
        nextScene: 'c4_hub',
        timeCost: 0,
        effects: { productivity: 10 },
        narrative: '苦涩的咖啡因唤醒了你的大脑。',
      },
      {
        id: 'take_water_c4',
        text: '喝杯温开水',
        nextScene: 'c4_hub',
        timeCost: 0,
        effects: { hp: 8 },
        chapterRestFlag: 'chapter_4_rest_used',
        narrative: '温水下肚，感觉整个人都舒服了一些。',
      },
      {
        id: 'back_to_desk_c4',
        text: '返回工位',
        nextScene: 'c4_hub',
        timeCost: 0,
        effects: { hp: 4 },
        chapterRestFlag: 'chapter_4_rest_used',
        narrative: '你在茶水间发了一会儿呆，感觉好了一些。',
      },
    ],
  },

  chat_colleagues_c4: {
    id: 'chat_colleagues_c4',
    location: '办公区',
    title: '跨部门社交',
    description: '带新人累得够呛，同事们各有态度。你要去找谁？',
    choices: [
      {
        id: 'chat_hr_c4',
        text: '找 HR 姐姐聊聊',
        nextScene: 'c4_hub',
        timeCost: 0,
        narrative: 'HR 姐姐说中层最难，既要扛产出也要顾团队，别把自己耗干。',
        relationships: {
          characterId: 'hr_sister',
          summary: '带新人期间和 HR 姐姐倾诉中层压力。',
          affinityDelta: 5,
        },
      },
      {
        id: 'chat_sales_c4',
        text: '找销售哥聊聊',
        nextScene: 'c4_hub',
        timeCost: 0,
        effects: { charisma: 5 },
        narrative: '销售哥拍拍你肩膀：“管人比写代码难吧？记住，别替不会来事的人背太多锅。”',
        relationships: {
          characterId: 'sales_bro',
          summary: '带新人期间和销售哥交流职场生存法则。',
          affinityDelta: 5,
        },
      },
      {
        id: 'chat_newbie_wang_c4',
        text: '找小王聊聊',
        nextScene: 'c4_hub',
        timeCost: 0,
        narrative: '小王说他会努力改，但眼神里还是有些怕你再批评他。',
        relationships: {
          characterId: 'newbie_wang',
          summary: '工位闲聊时安抚小王，他表态会改进。',
          affinityDelta: 3,
        },
      },
      {
        id: 'chat_newbie_li_c4',
        text: '找小李聊聊',
        nextScene: 'c4_hub',
        timeCost: 0,
        narrative: '小李笑得很甜，话里却总在试探你对主管的态度。',
        relationships: {
          characterId: 'newbie_li',
          summary: '工位闲聊时发现小李在试探你的立场。',
          affinityDelta: -2,
        },
      },
    ],
  },

  // ================= 第五章检定 =================
  chapter5_check: {
    id: 'chapter5_check',
    chapterId: 'chapter_5',
    location: '系统',
    title: '命运的齿轮',
    description: '系统正在评估你的职场状态...',
    choices: [
      {
        id: 'c5_check_pass',
        text: '继续',
        nextScene: 'chapter5_start',
        statCheck: {
          stat: 'upwardManagement',
          min: 10,
          failText: '你和领导关系紧张，且在团队中孤立无援...',
          failScene: 'c5_check_fail_charisma',
        },
        narrative: '你凭借着和领导的良好关系，稳住了阵脚。',
      }
    ]
  },

  c5_check_fail_charisma: {
    id: 'c5_check_fail_charisma',
    location: '系统',
    title: '群众基础',
    description: '虽然领导对你不满，但看看团队是否支持你...',
    choices: [
      {
        id: 'c5_check_fail_2',
        text: '继续',
        nextScene: 'chapter5_start',
        statCheck: {
          stat: 'charisma',
          min: 20,
          failText: '你不仅得罪了领导，也失去了群众基础...',
          failScene: 'ending_bad_marginalized',
        },
        narrative: '虽然领导不喜欢你，但团队离不开你，你勉强存活了下来。',
      }
    ]
  },

  // ================= 第五章 =================
  chapter5_start: {
    id: 'chapter5_start',
    location: '公司大会议室',
    title: '经济危机',
    description: '年底的全员大会上，CEO 宣布公司面临严峻的经济危机，需要进行“组织架构优化”。会后，主管把你叫去，暗示你主动降薪或者去边缘业务线。',
    choices: [
      {
        id: 'c5_health_check',
        text: '深吸一口气，准备应对',
        nextScene: 'c5_layoff_talk',
        statCheck: {
          stat: 'hp',
          min: 30,
          failText: '连日的加班和高压让你突然感到一阵眩晕，你倒在了办公室里...',
          failScene: 'ending_bad_health',
        },
        narrative: '你强打精神，走进了主管的办公室。',
      }
    ]
  },

  c5_layoff_talk: {
    id: 'c5_layoff_talk',
    location: '主管办公室',
    title: '裁员博弈',
    description: '主管语重心长地说：“现在的环境大家都不容易，你要理解公司的难处。如果你愿意主动降薪 30%，我可以保你留在核心团队；否则，只能把你调去那个快被裁撤的边缘业务线了。”',
    choices: [
      {
        id: 'c5_agree_boss',
        text: '妥协：“我愿意降薪，只要能留在核心团队。”',
        nextScene: 'c5_hub',
        effects: { upwardManagement: 10, productivity: -10 },
        narrative: '主管拍了拍你的肩膀：“识时务者为俊杰。”但你心里清楚，这只是缓兵之计。',
        relationships: {
          characterId: 'boss',
          summary: '裁员压力下接受主管的降薪建议，暂时维持表面关系。',
          affinityDelta: 6,
        },
      },
      {
        id: 'c5_fight_boss',
        text: '硬刚：“这不符合劳动合同，我不接受单方面降薪或调岗。”',
        nextScene: 'c5_learn_law',
        effects: { upwardManagement: -20 },
        narrative: '主管脸色一沉：“那你自己去和 HR 谈吧。”',
        relationships: {
          characterId: 'boss',
          summary: '拒绝主管提出的降薪和调岗安排，关系明显恶化。',
          affinityDelta: -15,
        },
      }
    ]
  },

  c5_learn_law: {
    id: 'c5_learn_law',
    location: '你的工位',
    title: '学习劳动法',
    description: '你回到了工位，知道接下来将是一场硬仗。你打开了网页，开始疯狂恶补《劳动合同法》关于单方面调岗降薪和经济补偿的条款。',
    choices: [
      {
        id: 'c5_get_law_flag',
        text: '熟读并背诵全文 (获得隐藏状态：精通劳动法)',
        nextScene: 'c5_hub',
        setFlag: 'learned_labor_law',
        narrative: '你把 N+1、违法解除 2N、录音取证等知识点牢记于心。',
        relationships: {
          characterId: 'hr_sister',
          summary: '为了后续谈判开始研究劳动法和取证策略。',
          affinityDelta: -2,
        },
      }
    ]
  },

  c5_hub: {
    id: 'c5_hub',
    location: '你的工位',
    title: '风雨飘摇',
    description: '公司里人心惶惶，每天都有人抱着纸箱离开。裁员季里，小王和小李的状态直接决定团队还能不能撑住。你需要分别稳住他们，再判断下一步。',
    choices: [
      {
        id: 'go_mentor_wang_c5',
        text: '单独辅导小王 (耗时1小时)',
        nextScene: 'c5_mentor_wang',
        timeCost: 1,
        narrative: '你把小王叫到了小会议室。',
      },
      {
        id: 'go_manage_li_c5',
        text: '单独对齐小李 (耗时1小时)',
        nextScene: 'c5_manage_li',
        timeCost: 1,
        narrative: '你在走廊拦住了正准备去主管办公室的小李。',
      },
      {
        id: 'go_pantry_c5',
        text: '去茶水间休息 (耗时1小时)',
        nextScene: 'pantry_c5',
        timeCost: 1,
        narrative: '你起身走向了茶水间。',
      },
      {
        id: 'go_chat_c5',
        text: '找同事闲聊 (耗时1小时)',
        nextScene: 'chat_colleagues_c5',
        timeCost: 1,
        narrative: '你决定去打听一下风声。',
      },
      {
        id: 'work_indie_dev_c5',
        text: '用电脑研究独立开发 (耗时2小时)',
        nextScene: 'c5_hub',
        timeCost: 2,
        requireFlag: 'chapter3_started',
        lockedText: '需先在 Mac 上解锁独立开发',
        effects: { indieDev: 8 },
        repeatableEffects: { hp: -2 },
        narrative: '裁员邮件一封接一封，你反而沉下心来敲代码——至少这件事，回报完全属于自己。',
      },
      {
        id: 'c5_team_sync',
        text: '召开三人复盘会 (耗时2小时)',
        nextScene: 'c5_hub',
        timeCost: 2,
        requireFlags: ['c5_wang_mentored', 'c5_li_handled'],
        lockedText: '需先辅导小王并对齐小李',
        setFlag: 'chapter5_cleared',
        narrative: '你把小王和小李都叫到会议室，明确了分工、底线和互相兜底的方式。团队暂时稳住了。',
        relationships: [
          {
            characterId: 'newbie_wang',
            summary: '三人复盘会上小王愿意承担可交付模块，不再独自恐慌。',
            affinityDelta: 5,
          },
          {
            characterId: 'newbie_li',
            summary: '三人复盘会上小李被迫接受公开分工，短期内不敢再甩锅。',
            affinityDelta: 2,
          },
        ],
      },
      {
        id: 'start_chapter6',
        text: '【进入最终章】寻找出路',
        nextScene: 'chapter6_start',
        requireFlag: 'chapter5_cleared',
        lockedText: '需先稳住下属团队',
        narrative: '团队暂时稳住了。接下来，你要为自己和骨干争取一个体面的收场。',
      },
    ],
  },

  c5_mentor_wang: {
    id: 'c5_mentor_wang',
    location: '小会议室',
    title: '稳住小王',
    description: '小王盯着招聘软件发呆，嘴里念叨着“刚毕业是不是最容易被裁”。他需要你给的是具体办法，不是空话。',
    choices: [
      {
        id: 'c5_wang_code_review',
        text: '陪他复盘线上事故，整理可复用 checklist',
        nextScene: 'c5_hub',
        timeCost: 0,
        effects: { productivity: 5 },
        setFlag: 'c5_wang_mentored',
        narrative: '你们把那次事故拆成触发条件、回滚步骤和 Review 清单。小王第一次觉得自己“能学会”，而不是只会闯祸。',
        relationships: {
          characterId: 'newbie_wang',
          summary: '裁员季陪小王复盘事故并建立 checklist，帮他重建技术自信。',
          affinityDelta: 10,
        },
      },
      {
        id: 'c5_wang_resume_help',
        text: '帮他改简历，把项目亮点写成可验证成果',
        nextScene: 'c5_hub',
        timeCost: 0,
        effects: { charisma: 5 },
        setFlag: 'c5_wang_mentored',
        narrative: '你把他的练手项目改写成“故障响应时间缩短 40%”。小王眼里终于有了光。',
        relationships: {
          characterId: 'newbie_wang',
          summary: '帮小王把项目经历改写成可验证成果，缓解裁员焦虑。',
          affinityDelta: 8,
        },
      },
      {
        id: 'c5_wang_assign_module',
        text: '分给他一块独立但风险可控的模块',
        nextScene: 'c5_hub',
        timeCost: 0,
        setFlag: 'c5_wang_mentored',
        narrative: '你让他负责内部工具链的小模块，并安排每日 15 分钟站会同步。小王开始主动提问，而不是只会硬冲。',
        relationships: {
          characterId: 'newbie_wang',
          summary: '分给小王独立可控模块并建立同步机制，让他进入稳定产出节奏。',
          affinityDelta: 12,
        },
      },
      {
        id: 'c5_wang_back',
        text: '先返回工位',
        nextScene: 'c5_hub',
        timeCost: 0,
        narrative: '你决定稍后再找他深聊。',
      },
    ],
  },

  c5_manage_li: {
    id: 'c5_manage_li',
    location: '走廊',
    title: '对齐小李',
    description: '小李抱着笔记本电脑，笑得依旧很甜，但你知道裁员季里“会汇报”的人往往也最危险。你需要把边界划清楚。',
    choices: [
      {
        id: 'c5_li_set_kpi',
        text: '当众摊开任务清单，明确交付和截止时间',
        nextScene: 'c5_hub',
        timeCost: 0,
        effects: { upwardManagement: 8 },
        setFlag: 'c5_li_handled',
        narrative: '你把接口、文档和联调节点写在白板上，要求每天更新。小李的笑僵了一秒，但还是点头接了任务。',
        relationships: {
          characterId: 'newbie_li',
          summary: '当众对齐小李的交付清单，限制他在裁员季继续甩锅。',
          affinityDelta: -3,
        },
      },
      {
        id: 'c5_li_draw_line',
        text: '明确红线：越界甩锅会留下书面记录',
        nextScene: 'c5_hub',
        timeCost: 0,
        effects: { upwardManagement: 5, charisma: -3 },
        setFlag: 'c5_li_handled',
        narrative: '你平静地告诉他：季度汇报上的暗示，你已经记下来了。小李沉默片刻，说“那我们按流程来”。',
        relationships: {
          characterId: 'newbie_li',
          summary: '向小李划清甩锅红线，并留下可追溯记录。',
          affinityDelta: -8,
        },
      },
      {
        id: 'c5_li_pair_wang',
        text: '安排他和小王结对，互相 Review 交付物',
        nextScene: 'c5_hub',
        timeCost: 0,
        setFlag: 'c5_li_handled',
        narrative: '你要求两人互相 Review PR 和接口文档。小李没法再只靠 PPT 糊弄，小王也有了“证人”。',
        relationships: [
          {
            characterId: 'newbie_li',
            summary: '安排小李与小王结对互审，压缩他甩锅空间。',
            affinityDelta: 0,
          },
          {
            characterId: 'newbie_wang',
            summary: '通过与小李结对互审，小王获得了更多技术自信。',
            affinityDelta: 5,
          },
        ],
      },
      {
        id: 'c5_li_back',
        text: '先返回工位',
        nextScene: 'c5_hub',
        timeCost: 0,
        narrative: '你决定稍后再和他谈。',
      },
    ],
  },

  pantry_c5: {
    id: 'pantry_c5',
    location: '茶水间',
    title: '能量补给',
    description: '茶水间里人比平时少了很多。你要来点什么？',
    choices: [
      {
        id: 'take_snack_c5',
        text: '吃点高糖零食',
        nextScene: 'c5_hub',
        timeCost: 0,
        effects: { hp: -5, productivity: 5 },
        narrative: '糖分让你短暂地充满了力量。',
      },
      {
        id: 'take_coffee_c5',
        text: '来杯冰美式',
        nextScene: 'c5_hub',
        timeCost: 0,
        effects: { productivity: 10 },
        narrative: '苦涩的咖啡因唤醒了你的大脑。',
      },
      {
        id: 'take_water_c5',
        text: '喝杯温开水',
        nextScene: 'c5_hub',
        timeCost: 0,
        effects: { hp: 8 },
        chapterRestFlag: 'chapter_5_rest_used',
        narrative: '温水下肚，感觉整个人都舒服了一些。',
      },
      {
        id: 'back_to_desk_c5',
        text: '返回工位',
        nextScene: 'c5_hub',
        timeCost: 0,
        effects: { hp: 4 },
        chapterRestFlag: 'chapter_5_rest_used',
        narrative: '你在茶水间发了一会儿呆，感觉好了一些。',
      },
    ],
  },

  chat_colleagues_c5: {
    id: 'chat_colleagues_c5',
    location: '办公区',
    title: '危机中的社交',
    description: '裁员风声四起，同事们各怀心事。你也可以顺路再和小王、小李聊聊。',
    choices: [
      {
        id: 'c5_chat_hr',
        text: '找 HR 姐姐探口风',
        nextScene: 'c5_hub',
        timeCost: 0,
        narrative: 'HR 姐姐叹了口气：“这次裁员比例很高，你自己多保重。”',
        relationships: {
          characterId: 'hr_sister',
          summary: '危机时期向 HR 姐姐打探消息。',
          affinityDelta: 2,
        },
      },
      {
        id: 'c5_chat_sales',
        text: '找销售哥聊聊',
        nextScene: 'c5_hub',
        timeCost: 0,
        narrative: '销售哥满不在乎：“我早就找好下家了，此处不留爷自有留爷处。”',
        relationships: {
          characterId: 'sales_bro',
          summary: '危机时期和销售哥交流，发现他早已找好退路。',
          affinityDelta: 2,
        },
      },
      {
        id: 'c5_chat_wang',
        text: '听小王倾诉裁员焦虑',
        nextScene: 'c5_hub',
        timeCost: 0,
        narrative: '小王很焦虑：“我刚毕业不会被裁吧？”你把之前带他的经历一件件讲给他听，让他知道自己不是“一次性耗材”。',
        relationships: {
          characterId: 'newbie_wang',
          summary: '危机时期倾听小王的裁员焦虑，并给他具体信心。',
          affinityDelta: 5,
        },
      },
      {
        id: 'c5_chat_wang_incident',
        text: '和小王一起重走线上事故时间线',
        nextScene: 'c5_hub',
        timeCost: 0,
        effects: { productivity: 3 },
        narrative: '你们在白板前把那次事故按分钟复盘了一遍。小王说：“原来我不是废物，我只是当时太急了。”',
        relationships: {
          characterId: 'newbie_wang',
          summary: '和小王重走线上事故时间线，帮他从自责中走出来。',
          affinityDelta: 6,
        },
      },
      {
        id: 'c5_chat_li',
        text: '观察小李在主管办公室外的举动',
        nextScene: 'c5_hub',
        timeCost: 0,
        narrative: '小李正频繁地进出主管办公室，似乎在谋划着什么。你记下了时间和话题方向。',
        relationships: {
          characterId: 'newbie_li',
          summary: '危机时期观察小李，发现他正在积极自保。',
          affinityDelta: -2,
        },
      },
      {
        id: 'c5_chat_li_warning',
        text: '提醒小李：裁员季甩锅会反噬整个组',
        nextScene: 'c5_hub',
        timeCost: 0,
        effects: { upwardManagement: 3 },
        narrative: '你当面提醒他：组里若内斗，主管只会整组端掉。小李沉默了一会儿，说“我明白你的意思”。',
        relationships: {
          characterId: 'newbie_li',
          summary: '提醒小李裁员季内斗会连累整组，迫使他收敛。',
          affinityDelta: 1,
        },
      },
      {
        id: 'c5_chat_duo',
        text: '把小王和小李都叫到茶水间，统一同步裁员口径',
        nextScene: 'c5_hub',
        timeCost: 0,
        requireFlags: ['c5_wang_mentored', 'c5_li_handled'],
        lockedText: '需先完成单独辅导与对齐',
        narrative: '你要求两人对外口径一致：先保交付，再谈去留。小王点头，小李也没再阴阳怪气。',
        relationships: [
          {
            characterId: 'newbie_wang',
            summary: '茶水间统一口径时，小王愿意配合团队对外发声。',
            affinityDelta: 3,
          },
          {
            characterId: 'newbie_li',
            summary: '茶水间统一口径时，小李暂时收敛个人算计。',
            affinityDelta: 2,
          },
        ],
      },
    ],
  },

  // ================= 最终章 =================
  chapter6_start: {
    id: 'chapter6_start',
    chapterId: 'chapter_6',
    location: 'HR 办公室',
    title: '最终谈判',
    description: '你坐在 HR 面前，准备为这段时间的拉扯画上句号。HR 刚要开口，她的手机响了——财务部、法务部、CEO 办公室的电话几乎同时打进来。',
    choices: [
      {
        id: 'c6_protect_team',
        text: '出示分工清单与证据，为团队骨干争取体面方案',
        nextScene: 'chapter6_bankruptcy',
        requireFlags: ['chapter5_cleared', 'learned_labor_law'],
        lockedText: '需稳住下属团队并精通劳动法',
        narrative: '你把三人复盘的分工和录音摆上桌面。HR 还没来得及回应，法务总监冲进来：“别谈了，法院刚受理破产申请。”',
        relationships: [
          {
            characterId: 'newbie_wang',
            summary: '谈判桌上刚摆出团队证据，公司便宣布进入破产程序。',
            affinityDelta: 3,
          },
          {
            characterId: 'newbie_li',
            summary: '谈判桌上刚摆出团队证据，公司便宣布进入破产程序。',
            affinityDelta: 1,
          },
          {
            characterId: 'hr_sister',
            summary: 'HR 办公室里的谈判被破产公告打断。',
            affinityDelta: 0,
          },
        ],
      },
      {
        id: 'c6_quit_naked',
        text: '“我受够了，我裸辞！”',
        nextScene: 'chapter6_bankruptcy',
        setFlag: 'quit_naked',
        narrative: '你签下离职协议，刚走出 HR 办公室，就听见走廊里有人在喊：“公司申请破产了！”',
        relationships: {
          characterId: 'hr_sister',
          summary: '裸辞签字后立刻得知公司破产。',
          affinityDelta: 0,
        },
      },
      {
        id: 'c6_demand_n1',
        text: '“公司单方面调岗降薪，请支付 N+1 经济补偿金。”',
        nextScene: 'chapter6_bankruptcy',
        requireFlag: 'learned_labor_law',
        setFlag: 'got_n1',
        narrative: '你亮出劳动法条款。HR 苦笑：“不是不赔，是公司今天进了破产程序。员工债权得去管理人那里登记。”',
        relationships: {
          characterId: 'hr_sister',
          summary: '主张 N+1 时得知公司进入破产清算，转为登记员工债权。',
          affinityDelta: -5,
        },
      },
      {
        id: 'c6_demand_fail',
        text: '“你们这是违法的，我要去告你们！”',
        nextScene: 'chapter6_bankruptcy',
        narrative: 'HR 没跟你争辩，直接把一份法院受理通知书拍在桌上：“公司已经申请破产了，去告也得排队当债权人。”',
        relationships: {
          characterId: 'hr_sister',
          summary: '威胁起诉时发现公司已进入破产程序。',
          affinityDelta: -8,
        },
      },
    ],
  },

  chapter6_bankruptcy: {
    id: 'chapter6_bankruptcy',
    chapterId: 'chapter_6',
    location: '公司大楼',
    title: '公司破产',
    description: '全员信发出来了：公司因资金链断裂进入破产清算。破产管理人接管公章，工位贴封条，会议室改作债权申报点。裁员、降薪、谈判……都成了清算清单里的一行字。无论刚才选了哪条路，结局都一样——这家公司没了。',
    choices: [
      {
        id: 'c6_bankruptcy_protect_team',
        text: '在清算会议上为团队骨干争取安置',
        nextScene: 'ending_good_chapter5',
        requireFlags: ['chapter5_cleared', 'learned_labor_law'],
        lockedText: '需稳住下属团队并精通劳动法',
        narrative: '你带着分工清单和劳动法条款坐到清算会议桌前，为小王、小李和你自己争取到了相对体面的安置方案。',
        relationships: [
          {
            characterId: 'newbie_wang',
            summary: '破产清算会上你为小王争取到了安置方案。',
            affinityDelta: 8,
          },
          {
            characterId: 'newbie_li',
            summary: '破产清算会上公开分工证据，小李被纳入可控交接安排。',
            affinityDelta: 3,
          },
          {
            characterId: 'hr_sister',
            summary: '破产清算会上凭证据为团队争取安置，管理人认可你的材料。',
            affinityDelta: 5,
          },
        ],
      },
      {
        id: 'c6_bankruptcy_creditor',
        text: '提交劳动合同与欠薪证明，登记员工债权',
        nextScene: 'c6_settlement',
        requireFlag: 'learned_labor_law',
        lockedText: '需精通劳动法',
        setFlag: 'got_n1',
        narrative: '破产管理人收下你的材料，告诉你员工债权在清偿顺序里相对靠前——但清算周期可能要等很久。',
        relationships: {
          characterId: 'hr_sister',
          summary: '向破产管理人登记员工债权，等待清算分配。',
          affinityDelta: -3,
        },
      },
      {
        id: 'c6_bankruptcy_leave',
        text: '抱着纸箱离开大楼',
        nextScene: 'c6_settlement',
        narrative: '你抱着纸箱走出旋转门。玻璃幕墙里曾经忙碌的灯光一盏盏熄灭，公司 Logo 还在，但已经不属于任何人了。',
      },
    ],
  },

  c6_settlement: {
    id: 'c6_settlement',
    location: '街角咖啡馆',
    title: '破产之后',
    description: '公司没了。你坐在街角咖啡馆里，看着窗外行色匆匆的打工人——有人刚失业，有人还不知道消息。你打开 Mac，思考破产清算之后自己的路。',
    choices: [
      {
        id: 'c6_end_indie',
        text: '【结局】全职做独立开发',
        nextScene: 'ending_good_indie',
        requireFlag: 'got_n1', // 假设有赔偿金才有底气全职
        statCheck: {
          stat: 'indieDev',
          min: 30,
          failText: '你的独立开发技能还不足以支撑你全职做这个...',
          failScene: 'c6_settlement_fallback',
        },
        narrative: '你决定把之前在公司摸鱼写的 App 商业化。',
      },
      {
        id: 'c6_end_hobby',
        text: '【结局】把爱好变成主业',
        nextScene: 'ending_good_hobby',
        requireFlag: 'got_n1',
        statCheck: {
          stat: 'hobby',
          min: 30,
          failText: '你的爱好还停留在自娱自乐的阶段...',
          failScene: 'c6_settlement_fallback',
        },
        narrative: '你决定把之前在会议室培养的爱好发展成事业。',
      },
      {
        id: 'c6_end_next_job',
        text: '【结局】带着积累去下一站',
        nextScene: 'ending_good_next_job',
        requireFlag: 'got_n1',
        narrative: '你把项目经历、副业尝试和业余探索都写进简历。清算款让你有底气慢慢挑，而不是被迫随便签约。',
      },
      {
        id: 'c6_extra_industry_event',
        text: '【番外】用工牌参加行业活动',
        nextScene: 'extra_industry_event_start',
        requireItem: 'badge',
        lockedText: '需持有工牌',
        narrative: '你翻出还没归还的工牌。也许趁它失效前，还能去参加一场公司合作的行业活动，看看外面的世界。',
      },
      {
        id: 'c6_end_next_job_naked',
        text: '【结局】带着积累去下一站',
        nextScene: 'ending_good_next_job',
        requireFlag: 'quit_naked',
        narrative: '虽然没有赔偿金，但这些年攒下的技术底子和业余尝试，让你投出的简历第一次收到了多家回音。',
      }
    ]
  },

  // ================= 番外篇 =================
  extra_industry_event_start: {
    id: 'extra_industry_event_start',
    chapterId: 'extra_industry_event',
    location: '行业峰会会场',
    title: '番外：工牌还能刷开哪扇门',
    description: '你握着还没失效的工牌，站在行业峰会门口。结局已经落定，但世界还在继续运转——展台、圆桌、茶歇区里都是递名片的人。这里看起来像机会，也像另一个更精致的职场。',
    choices: [
      {
        id: 'extra_listen_panel',
        text: '参加圆桌讨论，交换行业信息 (耗时2小时)',
        nextScene: 'extra_industry_event_hub',
        timeCost: 2,
        effects: { charisma: 5 },
        setFlag: 'extra_industry_insight',
        narrative: '你听到几位创业者聊裁员潮、外包机会和垂直工具的真实需求。这些信息比公司内网里的战略口号具体得多。',
        relationships: {
          characterId: 'project_manager',
          summary: '在行业活动上补齐了项目经理常挂嘴边的业务指标背后的真实市场信息。',
          affinityDelta: 3,
        },
      },
      {
        id: 'extra_pitch_self',
        text: '向参会者介绍自己的独立开发想法 (耗时3小时)',
        nextScene: 'extra_industry_event_hub',
        timeCost: 3,
        effects: { indieDev: 10 },
        setFlag: 'extra_validated_idea',
        narrative: '你用几分钟讲清楚自己的产品设想，竟然有人认真追问价格和上线时间。第一次，你觉得这个副业不只是自娱自乐。',
      },
      {
        id: 'extra_end_indie_start',
        text: '【结局】全职成为独立开发者',
        nextScene: 'ending_good_indie',
        statCheck: {
          stat: 'indieDev',
          min: 30,
          failText: '你的产品想法还不够成熟，独立开发能力也还有差距...',
          failScene: 'extra_industry_event_start',
        },
        narrative: '会场上的反馈让你确信：这不是副业，而是下一份事业。你决定全职投入。',
      },
      {
        id: 'extra_leave',
        text: '收起工牌，离开会场',
        nextScene: 'c6_settlement',
        timeCost: 1,
        narrative: '你把工牌塞回包里。它曾经代表公司，现在更像一个提醒：身份只是临时的，能力才是长期资产。',
      },
    ],
  },

  extra_industry_event_hub: {
    id: 'extra_industry_event_hub',
    location: '行业峰会会场',
    title: '茶歇时间',
    description: '活动进入茶歇。你可以继续社交，也可以把刚听到的信息带回咖啡馆，重新思考自己的下一步。',
    choices: [
      {
        id: 'extra_convert_to_indie',
        text: '把活动反馈整理成产品路线图 (耗时3小时)',
        nextScene: 'c6_settlement',
        timeCost: 3,
        effects: { indieDev: 10 },
        requireFlag: 'extra_validated_idea',
        narrative: '你把用户痛点、定价假设和 MVP 范围写成了一页路线图。下一步不再模糊。',
      },
      {
        id: 'extra_end_indie_hub',
        text: '【结局】全职成为独立开发者',
        nextScene: 'ending_good_indie',
        statCheck: {
          stat: 'indieDev',
          min: 30,
          failText: '你的产品想法还不够成熟，独立开发能力也还有差距...',
          failScene: 'extra_industry_event_hub',
        },
        narrative: '茶歇时你越想越清楚：市场有需求，技术也接得住。是时候自己干了。',
      },
      {
        id: 'extra_back_to_cafe',
        text: '回到咖啡馆',
        nextScene: 'c6_settlement',
        timeCost: 1,
        narrative: '你离开会场，街上的风让你清醒了一些。',
      },
    ],
  },

  c6_settlement_fallback: {
    id: 'c6_settlement_fallback',
    location: '街角咖啡馆',
    title: '换个角度',
    description: '全职独立开发或把爱好变主业，时机也许还没到。但这些年攒下的技术和业余积累，依然让你在职场里多了几条路可以走。',
    choices: [
      {
        id: 'c6_fallback_next_job',
        text: '【结局】带着积累去下一站',
        nextScene: 'ending_good_next_job',
        narrative: '你重新打开招聘软件——这一次，不只是投简历，而是在挑下一站。',
      }
    ]
  },

  // ================= 结局场景 =================
  ending_bad_fired: {
    id: 'ending_bad_fired',
    location: '公司大门',
    title: '扫地出门',
    description: '由于你不懂劳动法，HR 轻易地用各种规章制度拿捏了你。你不仅没有拿到一分钱赔偿，还背上了一个“不胜任工作”的背调评价。',
    choices: [
      {
        id: 'game_over_fired',
        text: '黯然离开',
        nextScene: 'ending_bad_fired',
        timeCost: 0,
      },
    ],
  },

  ending_good_next_job: {
    id: 'ending_good_next_job',
    location: '新公司工位',
    title: '充满希望的下一站',
    description: '你入职了新公司。这些年扛过的项目、摸鱼时写下的代码、会议室里偷偷培养的爱好，都没有白费——它们写进了你的简历，也写进了你的底气。你有机会挑更合适的团队，谈更合理的节奏，甚至把副业继续留在晚上。下一站不是重复上一站的消耗，而是更多选择真正向你敞开。',
    choices: [
      {
        id: 'game_over_next_job',
        text: '迎接下一站',
        nextScene: 'ending_good_next_job',
      },
    ],
  },

  ending_good_indie: {
    id: 'ending_good_indie',
    location: '海边咖啡馆',
    title: '独立开发者',
    description: '你全职投入到了之前开发的 App 中。几个月后，App 获得了苹果的推荐，你的被动收入已经超过了之前的工资。你买了一张去大理的机票，开启了数字游民的生活。',
    choices: [
      {
        id: 'game_over_indie',
        text: '享受生活',
        nextScene: 'ending_good_indie',
      },
    ],
  },

  ending_good_hobby: {
    id: 'ending_good_hobby',
    location: '自己的工作室',
    title: '把爱好变主业',
    description: '你用 N+1 的赔偿金租下了一个小工作室，把你之前在会议室里培养的爱好变成了真正的事业。虽然刚开始很艰难，但做自己喜欢的事情，每天都充满干劲。',
    choices: [
      {
        id: 'game_over_hobby',
        text: '享受生活',
        nextScene: 'ending_good_hobby',
      },
    ],
  },

  ending_good_chapter5: {
    id: 'ending_good_chapter5',
    location: '公司楼下',
    title: '护住团队',
    description: '公司破产了，但你没有让团队在最后一刻各自逃命。清算会上，你带着分工清单和劳动法条款，为小王、小李和核心骨干争取到了相对体面的安置。你走出大楼时，小王发来消息：“哥，谢谢你没丢下我们。”',
    choices: [
      {
        id: 'game_over_chapter5_good',
        text: '收起工牌，开始下一程',
        nextScene: 'ending_good_chapter5',
        timeCost: 0,
      },
    ],
  },

  ending_bad_marginalized: {
    id: 'ending_bad_marginalized',
    location: '角落的工位',
    title: '被边缘化',
    description: '由于和领导冲突过多，且没有建立起足够的人脉羽翼，你在绩效评估中被打成了最低档。你的核心项目被剥夺，每天只能做一些边角料的打杂工作。',
    choices: [
      {
        id: 'game_over_marginalized',
        text: '黯然离开',
        nextScene: 'ending_bad_marginalized',
        timeCost: 0,
      },
    ],
  },

  ending_bad_health: {
    id: 'ending_bad_health',
    location: '医院病房',
    title: '积劳成疾',
    description: '长期的熬夜加班、吃高糖零食和高压的工作环境，最终压垮了你的身体。你躺在病床上，看着天花板，意识到再高的绩效也换不回健康。',
    choices: [
      {
        id: 'game_over_health',
        text: '闭上眼睛',
        nextScene: 'ending_bad_health',
      },
    ],
  },

  ending_bad_backstab: {
    id: 'ending_bad_backstab',
    location: 'HR 办公室',
    title: '遭遇背刺',
    description: '你本以为顾全大局能换来团队的和谐，没想到小李利用你的揽责，向主管提交了一份长篇报告，把所有的延期和架构问题都推到了你头上。主管认为你不仅能力不行，还缺乏管理魄力。你被降级调岗，而小李则踩着你成功上位。',
    choices: [
      {
        id: 'game_over_backstab',
        text: '黯然离开',
        nextScene: 'ending_bad_backstab',
        timeCost: 0,
      },
    ],
  },
};
