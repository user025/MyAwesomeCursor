import type { Scene } from '../../engine/types';

export const SCENES: Record<string, Scene> = {
  lobby: {
    id: 'lobby',
    location: 'MegaCorp 大厅',
    title: '第一天',
    description: `玻璃大厦耸立在你面前，反射着晨光。大厅里铺着抛光大理石，盆栽蕨类点缀其间。前方是光洁的前台，右边是一部闪亮的电梯，左边藏着一扇楼梯间的门。你在 MegaCorp 的第一天开始了。`,
    choices: [
      {
        id: 'to_reception',
        text: '走向前台',
        nextScene: 'reception',
        timeCost: 5,
        narrative: '你挺直肩膀，朝前台走去。',
      },
      {
        id: 'to_elevator',
        text: '坐电梯',
        nextScene: 'elevator',
        timeCost: 5,
        narrative: '趁没人拦你，你直奔电梯。',
      },
      {
        id: 'to_explore',
        text: '先四处看看大厅',
        nextScene: 'lobby_explore',
        timeCost: 15,
        narrative: '先熟悉一下环境也好。你在大厅里逛了逛。',
      },
    ],
  },

  lobby_explore: {
    id: 'lobby_explore',
    location: 'MegaCorp 大厅',
    title: '探索',
    description: `你走过蕨类植物，注意到长椅上放着一张访客胸牌。一定是有人落下的。墙上还有一张大楼地图，标着食堂、IT 部门和顶层的高管套房。`,
    choices: [
      {
        id: 'grab_badge',
        text: '拿走访客胸牌',
        nextScene: 'reception',
        giveItem: 'name_badge',
        setFlag: 'has_badge',
        narrative: '你把胸牌揣进口袋。说不定用得上。',
        effects: { xp: 10 },
      },
      {
        id: 'leave_badge',
        text: '不管它，前往前台',
        nextScene: 'reception',
        narrative: '不关你的事。你朝前台走去。',
      },
    ],
  },

  elevator: {
    id: 'elevator',
    location: '电梯',
    title: '上行',
    description: `电梯门关上了。你并不是一个人——一个穿着不合身西装的高个子男人站在旁边，端着一杯咖啡，盯着楼层数字。沉默震耳欲聋。`,
    choices: [
      {
        id: 'small_talk',
        text: '闲聊几句',
        nextScene: 'elevator_talk',
        timeCost: 5,
        statCheck: {
          stat: 'charisma',
          min: 8,
          failText: '你支支吾吾地说不出完整句子。他往旁边挪了挪。',
          failScene: 'reception',
        },
        narrative: '"第一天？"你勉强挤出几个字。',
        effects: { xp: 10 },
      },
      {
        id: 'ignore',
        text: '低头看手机',
        nextScene: 'reception',
        timeCost: 3,
        narrative: '你刷着早就读过的邮件。',
      },
      {
        id: 'compliment',
        text: '夸他的领带',
        nextScene: 'elevator_talk',
        timeCost: 5,
        narrative: '"好领带！"你说。他眼前一亮。',
        setFlag: 'complimented_tie',
        effects: { charisma: 3, xp: 5 },
      },
    ],
  },

  elevator_talk: {
    id: 'elevator_talk',
    location: '电梯',
    title: '一个盟友',
    description: `他叫 Greg，财务部的。他在 MegaCorp 已经干了 12 年。"你会做好的，"他带着疲倦的笑容说。"就是 Todd 让你做的事，都别自愿去干。"他从桌上拿了一个减压球递给你。`,
    choices: [
      {
        id: 'thanks',
        text: '感谢 Greg，前往你的楼层',
        nextScene: 'reception',
        giveItem: 'stress_ball',
        setFlag: 'met_greg',
        effects: { xp: 15, charisma: 2 },
        narrative: '好建议。你感激地把减压球收好。',
      },
    ],
  },

  reception: {
    id: 'reception',
    location: '前台',
    title: '报到',
    description: `前台 Karen 从屏幕上抬起头。铭牌上写着："Karen——忍受你的废话第 14 年。"她上下打量着你。`,
    choices: [
      {
        id: 'friendly',
        text: '友好地自我介绍',
        nextScene: 'cubicle',
        effects: { charisma: 2, xp: 10 },
        setFlag: 'friendly_karen',
        narrative: '"哎呀，真是新鲜空气，"她笑了。她指了指格子间的方向。',
      },
      {
        id: 'professional',
        text: '保持专业，说明来意',
        nextScene: 'cubicle',
        effects: { productivity: 3, xp: 5 },
        narrative: '她对你的职业素养赞许地点点头，递给你一张访客登记表。',
      },
      {
        id: 'rude',
        text: '没好气地说——你是来工作的，不是来聊天的',
        nextScene: 'cubicle_rude',
        effects: { hp: -10, charisma: -3 },
        narrative: '她眯起眼睛，默默地指向格子间。',
      },
    ],
  },

  cubicle_rude: {
    id: 'cubicle_rude',
    location: '格子间',
    title: '开局不利',
    description: `你找到了你的格子间。和其他所有格子间一模一样——灰色布艺隔板、2018 年的显示器、一张早已过气的椅子。有人留了张便签："欢迎加入！——HR"，旁边放着一个变味的甜甜圈。你感觉自己已经得罪了这个看门人。`,
    choices: [
      {
        id: 'organize_cru',
        text: '整理你的办公桌',
        nextScene: 'meeting_room',
        giveItem: 'sticky_notes',
        effects: { productivity: 5, xp: 5 },
        narrative: '你在抽屉里找到一叠便签纸。情况开始好转了。',
      },
      {
        id: 'meeting_cru',
        text: '直接去开晨会',
        nextScene: 'meeting_room',
        effects: { productivity: 2 },
        narrative: '早点到，留个好印象。',
      },
    ],
  },

  cubicle: {
    id: 'cubicle',
    location: '格子间',
    title: '你的新家',
    description: `你找到了你的格子间。和其他所有格子间一模一样——灰色布艺隔板、2018 年的显示器、一张已过鼎盛时期的椅子。有人留了张便签："欢迎加入！——HR"，旁边放着一个变味的甜甜圈。隔壁桌一位神情疲惫的女同事 Priya 朝你摆了摆手。`,
    choices: [
      {
        id: 'organize',
        text: '先整理办公桌',
        nextScene: 'cubicle_organized',
        giveItem: 'sticky_notes',
        setFlag: 'organized_desk',
        effects: { productivity: 5, xp: 5 },
        narrative: '你找到一叠便签纸和一株意料之外还挺舒服的桌面植物。',
      },
      {
        id: 'chat_priya',
        text: '和邻桌 Priya 聊聊天',
        nextScene: 'cubicle_chat',
        setFlag: 'met_priya',
        narrative: '"嘿，我是新来的，"你转向邻桌说。',
      },
      {
        id: 'meeting',
        text: '直接去开晨会',
        nextScene: 'meeting_room',
        effects: { productivity: 2 },
        narrative: '你抓起记事本，走向会议室。',
      },
    ],
  },

  cubicle_organized: {
    id: 'cubicle_organized',
    location: '格子间',
    title: '安顿下来',
    description: `你把办公桌布置得恰到好处。植物给灰色隔间增添了一丝生气。Priya 从隔壁笑了。"第一天仪式是吧？我重新摆了三次才放弃。"她扔给你一条能量棒。"你会需要的。"`,
    choices: [
      {
        id: 'org_meeting',
        text: '和 Priya 一起去开晨会',
        nextScene: 'meeting_room',
        giveItem: 'snack_bar',
        setFlag: 'met_priya',
        effects: { xp: 5 },
        narrative: '你和 Priya 一起去会议室。',
      },
      {
        id: 'org_break',
        text: '先去喝杯咖啡',
        nextScene: 'break_room',
        giveItem: 'snack_bar',
        setFlag: 'met_priya',
        narrative: '见人之前得先来点咖啡因。',
      },
    ],
  },

  cubicle_chat: {
    id: 'cubicle_chat',
    location: '格子间',
    title: '办公室八卦',
    description: `Priya 探过头来。"你周一来上班？有胆量。Todd 自从季度复盘后心情就一直不好。"她压低声音。"千万别提预算削减的事。还有，有机会的话，跟 IT 的 Rick 搞好关系。他知道所有见不得光的事。"她递给你一条能量棒。`,
    choices: [
      {
        id: 'chat_meeting',
        text: '打听晨会的情况',
        nextScene: 'meeting_room',
        giveItem: 'snack_bar',
        setFlag: 'met_priya',
        effects: { charisma: 3, xp: 10 },
        narrative: '"Todd 主持每周站会。装出认真听的样子就行。"',
      },
      {
        id: 'chat_break',
        text: '去休息室喝杯咖啡',
        nextScene: 'break_room',
        giveItem: 'snack_bar',
        setFlag: 'met_priya',
        effects: { charisma: 2 },
        narrative: '第一天就交到盟友，不错。',
      },
    ],
  },

  break_room: {
    id: 'break_room',
    location: '休息室',
    title: '生命线',
    description: `休息室里隐约飘着焦爆米花和绝望的味道。咖啡机可怜地噗噗作响，"清洗我"的灯闪烁不停。台子上放着一盒变味的甜甜圈。冰箱上贴着一张充满暗示的便条，关于某人剩下的金枪鱼。`,
    choices: [
      {
        id: 'fix_coffee',
        text: '试着修咖啡机',
        nextScene: 'break_room_fixed',
        timeCost: 20,
        statCheck: {
          stat: 'productivity',
          min: 8,
          failText: '你乱按了几个按钮。咖啡机发出可怕的声音。你后退了几步。',
          failScene: 'break_room',
        },
        setFlag: 'fixed_coffee',
        narrative: '你卷起袖子，开始研究咖啡机。',
      },
      {
        id: 'grab_donut',
        text: '拿个甜甜圈',
        nextScene: 'break_room_donut',
        timeCost: 5,
        narrative: '免费食物就是免费食物。',
      },
      {
        id: 'br_meeting',
        text: '拿个咖啡胶囊，去开会',
        nextScene: 'meeting_room',
        giveItem: 'coffee',
        narrative: '胶囊咖啡机还能用。危机解除。',
      },
    ],
  },

  break_room_fixed: {
    id: 'break_room_fixed',
    location: '休息室',
    title: '咖啡胜利',
    description: `你巧妙的几下敲打就让咖啡机恢复了生机。它满意地咕噜着，出了一杯完美的咖啡。你正欣赏自己的杰作，IT 的 Rick 走了进来。"你修好了？Todd 说找人来修说了几周了。"他看起来印象深刻。`,
    choices: [
      {
        id: 'fixed_talk',
        text: '向 Rick 自我介绍',
        nextScene: 'break_room_rick',
        setFlag: 'met_rick',
        effects: { productivity: 5, xp: 15 },
        giveItem: 'coffee',
        narrative: '"我是 Rick。需要什么就来 IT 找我。"',
      },
      {
        id: 'fixed_meeting',
        text: '拿上咖啡去开会',
        nextScene: 'meeting_room',
        giveItem: 'coffee',
        effects: { xp: 10 },
        narrative: '你拿起新鲜咖啡，成就感满满地出了门。',
      },
    ],
  },

  break_room_rick: {
    id: 'break_room_rick',
    location: '休息室',
    title: 'IT 人脉',
    description: `Rick 啜着咖啡。"你挺懂机器的。四楼有个服务器问题，你要是有空可以来看看。不勉强。"他把一个 U 盘滑过台面。"等你决定帮忙的时候用。"然后他就消失了。`,
    choices: [
      {
        id: 'rick_meeting',
        text: '收起 U 盘，去开会',
        nextScene: 'meeting_room',
        giveItem: 'usb_drive',
        effects: { xp: 10, productivity: 3 },
        narrative: '你把神秘的 U 盘收好。一件一件来。',
      },
    ],
  },

  break_room_donut: {
    id: 'break_room_donut',
    location: '休息室',
    title: '糖分冲击',
    description: `甜甜圈虽然不新鲜了，但还能吃。你正拍掉衬衫上的糖粉，身后有人清了清嗓子。是你经理 Todd。他看起来不太满意。"会议室。五分钟。"他转身走了。`,
    choices: [
      {
        id: 'donut_meeting',
        text: '跟着 Todd 去开会',
        nextScene: 'meeting_room',
        giveItem: 'stale_donut',
        setFlag: 'caught_eating',
        effects: { hp: 10 },
        narrative: '你赶紧跟上去，一边拍掉衬衫上的甜甜圈碎屑。',
      },
    ],
  },

  meeting_room: {
    id: 'meeting_room',
    location: '会议室',
    title: '站会',
    description: `会议室里挤满了人。Todd 站在白板前，手里拿着记号笔。桌边：Priya 对你微微摆了摆手；财务部的 Greg 点了点头；还有几张你不认识的面孔。投影仪上亮着一份名为"Q3 协同效应计划"的表格。`,
    choices: [
      {
        id: 'volunteer',
        text: '主动承担新项目',
        nextScene: 'meeting_volunteer',
        statCheck: {
          stat: 'productivity',
          min: 12,
          failText: '你支支吾吾地说出一个半生不熟的想法。Todd 挑了挑眉。"我们……再聊。"',
          failScene: 'meeting_fail',
        },
        narrative: '"这个我想负责，"你自己都有点意外。',
      },
      {
        id: 'stay_quiet',
        text: '保持安静，观察',
        nextScene: 'meeting_quiet',
        narrative: '你记着笔记，吸收办公室的动态。',
      },
      {
        id: 'pitch_idea',
        text: '提出一个大胆的新想法',
        nextScene: 'meeting_pitch',
        statCheck: {
          stat: 'charisma',
          min: 12,
          failText: '你的想法反响平平。有人暗自发笑。Todd 迅速转移了话题。',
          failScene: 'meeting_fail',
        },
        narrative: '"如果我们重新设想整个工作流程呢？"你自信地说。',
      },
    ],
  },

  meeting_volunteer: {
    id: 'meeting_volunteer',
    location: '会议室',
    title: '主动请缨',
    description: `Todd 看起来印象深刻。"很好。Peterson 客户需要新视角。"他指派你主导调研。Priya 在房间另一头朝你竖起大拇指。你感到一阵自信涌来——你的第一个真正任务。`,
    choices: [
      {
        id: 'vol_work',
        text: '回办公桌开始调研',
        nextScene: 'desk_work',
        setFlag: 'volunteered',
        effects: { productivity: 10, xp: 25, charisma: 3 },
        narrative: '是时候证明自己了。',
      },
      {
        id: 'vol_todd',
        text: '会后找 Todd 谈谈',
        nextScene: 'boss_office',
        setFlag: 'volunteered',
        effects: { xp: 15, charisma: 2 },
        narrative: '"有空吗？"等人散去后你问道。',
      },
    ],
  },

  meeting_quiet: {
    id: 'meeting_quiet',
    location: '会议室',
    title: '低调行事',
    description: `你仔细地记着笔记。会议讨论了预算分配、新的 CRM 系统上线，还有一个叫 Dave 的人总把脏杯子留在洗手池里。你摸清了谁是谁，什么重要。知识就是力量。`,
    choices: [
      {
        id: 'quiet_desk',
        text: '回办公桌',
        nextScene: 'desk_work',
        effects: { xp: 10, productivity: 5 },
        narrative: '你回到格子间，笔记本里记满了情报。',
      },
      {
        id: 'quiet_break',
        text: '先去再来杯咖啡',
        nextScene: 'break_room',
        effects: { xp: 5 },
        narrative: '你回到休息室，现在更明白了。',
      },
    ],
  },

  meeting_pitch: {
    id: 'meeting_pitch',
    location: '会议室',
    title: '远见者',
    description: `房间安静下来。你的想法……居然说得通。Todd 摸着下巴。"我要你负责推进这个。"Priya 看起来印象深刻。Greg 缓缓点头。你的身价上涨了。`,
    choices: [
      {
        id: 'pitch_desk',
        text: '立即开始制定方案',
        nextScene: 'desk_work',
        setFlag: 'pitched_idea',
        effects: { charisma: 10, xp: 30, productivity: 5 },
        narrative: '你大步走回办公桌，浑身是劲。',
      },
      {
        id: 'pitch_rick',
        text: '去找 Rick 寻求技术支持',
        nextScene: 'it_closet',
        setFlag: 'pitched_idea',
        effects: { xp: 15, charisma: 3 },
        narrative: '好想法需要好的执行。Rick 能帮忙。',
      },
    ],
  },

  meeting_fail: {
    id: 'meeting_fail',
    location: '会议室',
    title: '哎哟',
    description: `你缩在椅子里，会议继续，你被远远抛在后面。Priya 投来同情的目光。Todd 继续下一个议程。不是你最好的时刻。不过这一天还长。`,
    choices: [
      {
        id: 'fail_desk',
        text: '退回办公桌',
        nextScene: 'desk_work',
        effects: { hp: -5 },
        narrative: '你灰溜溜地回到格子间，耳朵发烫。',
      },
      {
        id: 'fail_break',
        text: '去咖啡里淹死自己的愁闷',
        nextScene: 'break_room',
        effects: { hp: -5 },
        narrative: '休息室欢迎所有出过丑的人。',
      },
    ],
  },

  boss_office: {
    id: 'boss_office',
    location: 'Todd 的办公室',
    title: '老板',
    description: `Todd 的办公室里堆满了励志海报和旧科技杂志。他示意你坐下。"关上门。我想聊聊你在这里的未来。"他靠回椅背，审视着你。`,
    choices: [
      {
        id: 'impress',
        text: '给他看你的研究和想法',
        nextScene: 'boss_impress',
        statCheck: {
          stat: 'productivity',
          min: 18,
          failText: '你给他看了一些笔记。他翻了翻。"嗯。不错，但我期望更高。"',
          failScene: 'boss_neutral',
        },
        narrative: '你掏出笔记本，准备震撼老板。',
      },
      {
        id: 'ask_advice',
        text: '请教他在公司的生存之道',
        nextScene: 'boss_advice',
        narrative: '"我想在这里做好。有什么建议吗？"',
      },
      {
        id: 'honest',
        text: '坦诚自己感到不知所措',
        nextScene: 'boss_honest',
        narrative: '"第一天有点紧张，"你承认道。',
      },
    ],
  },

  boss_impress: {
    id: 'boss_impress',
    location: 'Todd 的办公室',
    title: '新星升起',
    description: `Todd 看着你的工作成果，眉头扬起。"这是……真细致。我在这干了十年，没见过第一天就这么出色的表现。"他合上笔记本。"我把你放在快车道上。保持下去，你会走得很远。"`,
    choices: [
      {
        id: 'impress_desk',
        text: '满面春风地回到办公桌',
        nextScene: 'desk_work',
        setFlag: 'impressed_todd',
        effects: { xp: 35, charisma: 5, productivity: 10 },
        narrative: '你飘回格子间。今天进展不错。',
      },
    ],
  },

  boss_advice: {
    id: 'boss_advice',
    location: 'Todd 的办公室',
    title: '导师',
    description: `Todd 轻笑。"第一条：永远别自愿去干 Dave 建议的任何事。第二条：在 IT 交朋友。第三条……"他凑近，"想清楚你想要什么，然后去争取。这里奖励主动性，不奖励打卡。"他意味深长地看了你一眼。`,
    choices: [
      {
        id: 'advice_desk',
        text: '感谢他，回去工作',
        nextScene: 'desk_work',
        setFlag: 'todd_advice',
        effects: { xp: 15, charisma: 5, productivity: 5 },
        narrative: '实在的建议。你带着新的专注回到工位。',
      },
    ],
  },

  boss_honest: {
    id: 'boss_honest',
    location: 'Todd 的办公室',
    title: '做个人',
    description: `Todd 的表情缓和了。"每个人都有这种感觉。有些日子我也有。"他打开抽屉，扔给你一罐功能饮料。"一次做一件事。你会找到节奏的。"这个主持周一站会的人，居然给出了出奇人性的建议。`,
    choices: [
      {
        id: 'honest_desk',
        text: '谢谢他，回去工作',
        nextScene: 'desk_work',
        giveItem: 'energy_drink',
        setFlag: 'todd_advice',
        effects: { xp: 10, hp: 10, charisma: 3 },
        narrative: '你感觉好多了。也许 Todd 没那么糟。',
      },
    ],
  },

  boss_neutral: {
    id: 'boss_neutral',
    location: 'Todd 的办公室',
    title: '还有提升空间',
    description: `Todd 把笔记本还给你。"继续努力。罗马不是一天建成的。"他看起来既没有失望，也没有被打动。中立的评价。`,
    choices: [
      {
        id: 'neutral_desk',
        text: '回办公桌',
        nextScene: 'desk_work',
        effects: { xp: 5 },
        narrative: '你有工作要做。',
      },
      {
        id: 'neutral_it',
        text: '去找 Rick',
        nextScene: 'it_closet',
        narrative: '是时候去交 Todd 说的那个 IT 朋友了。',
      },
    ],
  },

  it_closet: {
    id: 'it_closet',
    location: 'IT 机房',
    title: '服务器室',
    description: `IT 机房温暖而嗡嗡作响，是闪烁灯光和杂乱线缆的庇护所。Rick 在一张桌子下面嘀咕着。"如果这次迁移搞崩了邮件服务器，Todd 会疯掉的。"他滑出来，看见了你。"来得正好。你懂服务器机架吗？"`,
    choices: [
      {
        id: 'help_it',
        text: '帮 Rick 处理服务器',
        nextScene: 'it_help',
        statCheck: {
          stat: 'productivity',
          min: 10,
          failText: '你不小心拔错了线。灯光闪烁。Rick 叹了口气。"让我来吧。"',
          failScene: 'it_fail',
        },
        narrative: '"我略知一二，"你边说边掰了掰指关节。',
      },
      {
        id: 'pretend',
        text: '点头假装明白',
        nextScene: 'it_pretend',
        statCheck: {
          stat: 'charisma',
          min: 10,
          failText: 'Rick 立刻看穿了你的伪装。"你根本不知道我在说什么，对吧？"',
          failScene: 'it_fail',
        },
        narrative: '"当然，"你自信地说。',
      },
    ],
  },

  it_help: {
    id: 'it_help',
    location: 'IT 机房',
    title: '技术支持',
    description: `你和 Rick 一起把服务器机架收拾得服服帖帖。迁移完成了。"干得好，"Rick 由衷地说。"我欠你一个人情。"他递给你一个 U 盘。"这里有一些……有趣的文件。公司历史、旧组织架构图，真材实料。好好利用。"`,
    choices: [
      {
        id: 'help_desk',
        text: '回办公桌',
        nextScene: 'desk_work',
        giveItem: 'usb_drive',
        setFlag: 'helped_rick',
        effects: { productivity: 10, xp: 25, charisma: 3 },
        narrative: '你交到了一个有力的盟友。',
      },
    ],
  },

  it_pretend: {
    id: 'it_pretend',
    location: 'IT 机房',
    title: '蒙混过关',
    description: `你在所有正确的时机点头，随口说了句"你试过重启吗？"，Rick 居然信了。"你挺懂行的，"他说。"要是你想转到 IT，我需要你这样的人。"`,
    choices: [
      {
        id: 'pretend_desk',
        text: '趁他还没问具体问题赶紧撤',
        nextScene: 'desk_work',
        setFlag: 'met_rick',
        effects: { charisma: 5, xp: 15 },
        narrative: '好险。该回去做你真正懂的事了。',
      },
    ],
  },

  it_fail: {
    id: 'it_fail',
    location: 'IT 机房',
    title: '糟糕',
    description: `Rick 重重叹了口气，接手了。"我来处理吧。你也许还是……待在你的部门比较好。"他转身面对线缆，无可奈何。你退出机房，脸颊发烫。`,
    choices: [
      {
        id: 'fail_desk2',
        text: '灰溜溜地回办公桌',
        nextScene: 'desk_work',
        effects: { hp: -10, charisma: -3 },
        narrative: '交 IT 朋友的计划泡汤了。',
      },
    ],
  },

  desk_work: {
    id: 'desk_work',
    location: '你的格子间',
    title: '专注工作',
    description: `你坐在办公桌前，准备开始一天的工作。头顶的荧光灯嗡嗡作响。显示器亮着。一张电子表格等着你。办公室里回响着键盘轻响和远处电话铃声。你面前有几个选择。`,
    choices: [
      {
        id: 'work_hard',
        text: '埋头苦干',
        nextScene: 'work_hard_result',
        timeCost: 90,
        effects: { productivity: 5, xp: 10 },
        statCheck: {
          stat: 'caffeine',
          min: 10,
          failText: '你盯着屏幕。一片空白。你需要更多咖啡。',
          failScene: 'break_room',
        },
        narrative: '你一头扎进电子表格。干就完了。',
      },
      {
        id: 'work_explore',
        text: '探索办公楼',
        nextScene: 'explore_office',
        timeCost: 30,
        narrative: '你站起来活动活动腿，在走廊里逛了逛。',
      },
      {
        id: 'work_rick',
        text: '去找 Rick（如果你认识他）',
        nextScene: 'it_closet',
        requireFlag: 'met_rick',
        narrative: '去看看 Rick 在忙什么。',
      },
      {
        id: 'work_rooftop',
        text: '去天台透透气',
        nextScene: 'rooftop',
        timeCost: 20,
        requireFlag: 'has_badge',
        narrative: '访客胸牌应该能让你进天台。',
        setFlag: 'been_rooftop',
      },
      {
        id: 'work_rooftop_nobadge',
        text: '试试天台（没有胸牌）',
        nextScene: 'rooftop_no_badge',
        narrative: '你朝天台通道走去。',
      },
    ],
  },

  work_hard_result: {
    id: 'work_hard_result',
    location: '你的格子间',
    title: '高效模式',
    description: `你快速做完了电子表格，回了十几封邮件，还重构了团队的文件系统。Priya 吹了声口哨。"今天某人火力全开啊。"你的咖啡因驱动效率势不可挡。`,
    choices: [
      {
        id: 'hard_climax',
        text: '查收邮件——Todd 要见你',
        nextScene: 'climax',
        effects: { xp: 20, productivity: 10 },
        setFlag: 'worked_hard',
        narrative: '新邮件弹出："今天干得很好。下班前过来一趟。"',
      },
    ],
  },

  explore_office: {
    id: 'explore_office',
    location: '办公室走廊',
    title: '闲逛',
    description: `办公室是由一模一样走廊组成的迷宫。你经过人事部（诡异的安静），三楼一个没人的休息室（有好咖啡机），还有一间会议室里有人在对着盆栽练习演讲。`,
    choices: [
      {
        id: 'explore_climax',
        text: '回去——手机震了。Todd 要见你。',
        nextScene: 'climax',
        effects: { xp: 10 },
        narrative: '去看看老板有什么事。',
      },
    ],
  },

  rooftop: {
    id: 'rooftop',
    location: '天台',
    title: '新鲜空气',
    description: `天台出乎意料地不错。盆栽、几张长椅、令人惊叹的城市景观。门在你身后咔嗒一声锁上了，所以你只能待着。栏杆旁站着一个人——是前台 Karen，她在休息。她转过身来，笑了。`,
    choices: [
      {
        id: 'rooftop_talk',
        text: '和 Karen 聊聊',
        nextScene: 'rooftop_convo',
        setFlag: 'rooftop_karen',
        narrative: '"真巧啊，"你说。',
      },
      {
        id: 'rooftop_alone',
        text: '独自欣赏风景',
        nextScene: 'rooftop_alone_scene',
        narrative: '你深呼吸，享受片刻宁静。',
      },
    ],
  },

  rooftop_convo: {
    id: 'rooftop_convo',
    location: '天台',
    title: '和解',
    description: `Karen 轻笑。"抱歉刚才的态度。第一天总是很难。我见过上千个人从那些门里走进来。"她递给你一颗薄荷糖。"给你个建议——Todd 明天有个重要汇报。做得好，他会注意。搞砸了……"她做了个爆炸的手势。`,
    choices: [
      {
        id: 'convo_climax',
        text: '手机震了。Todd 要见你。立刻。',
        nextScene: 'climax',
        effects: { charisma: 5, xp: 15 },
        narrative: '上场时间到了。',
      },
    ],
  },

  rooftop_alone_scene: {
    id: 'rooftop_alone_scene',
    location: '天台',
    title: '片刻宁静',
    description: `城市在脚下铺展开来。办公室的喧嚣仿佛很遥远。你深吸一口气，感受着脸上的阳光。有那么一刻，你忘记了 TPS 报表和站会。然后手机震了。Todd。`,
    choices: [
      {
        id: 'alone_climax',
        text: '去 Todd 办公室',
        nextScene: 'climax',
        effects: { hp: 15, xp: 10 },
        narrative: '你回到楼内，神清气爽，准备就绪。',
      },
    ],
  },

  rooftop_no_badge: {
    id: 'rooftop_no_badge',
    location: '办公室走廊',
    title: '拒绝访问',
    description: `天台的门需要门禁卡。你没有。门上写着："天台——需要员工胸牌。"也许你该拿那个访客胸牌的。`,
    choices: [
      {
        id: 'noroof_desk',
        text: '回办公桌',
        nextScene: 'desk_work',
        narrative: '回到格子间。',
      },
    ],
  },

  climax: {
    id: 'climax',
    location: 'Todd 的办公室',
    title: '关键时刻',
    description: `Todd 坐在办公桌后，手指交叉。"关上门。"他带着难以琢磨的表情看着你。"我观察你一整天了。高管们都在楼下。他们需要有人在 10 分钟内汇报 Q3 战略。Dave 请病假了。"他顿了顿。"这是你的机会。你来吗？"`,
    choices: [
      {
        id: 'climax_yes',
        text: '说行——你准备好了',
        nextScene: 'presentation_room',
        timeCost: 10,
        statCheck: {
          stat: 'productivity',
          min: 25,
          failText: '你犹豫了，脑子一片空白。Todd 看出了你的迟疑。"我找别人吧。"他看起来不失望——更像是松了口气。',
          failScene: 'ending_neutral',
        },
        setFlag: 'presenting',
        narrative: '"我行，"你毫不犹豫地说。',
      },
      {
        id: 'climax_bold',
        text: '说行，但要讲你的方案',
        nextScene: 'presentation_bold',
        statCheck: {
          stat: 'charisma',
          min: 25,
          failText: '你开始讲你的想法。Todd 打断了你。"不是时候。按幻灯片讲。"',
          failScene: 'presentation_room',
        },
        setFlag: 'presenting_bold',
        narrative: '"我有更好的想法，"你说。"让我来讲那个。"',
      },
      {
        id: 'climax_no',
        text: '拒绝——你还没准备好',
        nextScene: 'ending_neutral',
        narrative: '"我觉得别人更适合，"你说。',
        effects: { charisma: -3 },
      },
    ],
  },

  presentation_room: {
    id: 'presentation_room',
    location: '高管会议室',
    title: '聚光灯下',
    description: `会议室里全是深色木头和严肃的面孔。高管们围坐在一张大桌旁。屏幕上亮着你的演示文稿。CEO 点头示意你开始。你的心跳加速。就是现在了。`,
    choices: [
      {
        id: 'present_good',
        text: '呈现自信、准备充分的汇报',
        nextScene: 'ending_good',
        timeCost: 45,
        statCheck: {
          stat: 'productivity',
          min: 30,
          failText: '汇报还行，但不算出色。你讲到了要点，但缺乏说服力。',
          failScene: 'ending_neutral',
        },
        setFlag: 'presented_well',
        narrative: '你深吸一口气，开始了。数小时的努力得到了回报。',
      },
      {
        id: 'present_charisma',
        text: '靠魅力和讲故事打动他们',
        nextScene: 'ending_good',
        statCheck: {
          stat: 'charisma',
          min: 25,
          failText: '你的魅力只能带你走到这儿。CFO 问了一个你答不上来的问题。',
          failScene: 'ending_neutral',
        },
        setFlag: 'presented_charm',
        narrative: '你描绘了一个让全场着迷的愿景。',
      },
    ],
  },

  presentation_bold: {
    id: 'presentation_bold',
    location: '高管会议室',
    title: '大胆演讲',
    description: `会议室座无虚席。你走上台，无视 Todd 准备的演示文稿。你清了清嗓子。"忘了那些幻灯片吧。这才是我们真正该做的事。"房间一片寂静。`,
    choices: [
      {
        id: 'bold_good',
        text: '自信地讲述你的大胆愿景',
        nextScene: 'ending_victory',
        timeCost: 45,
        statCheck: {
          stat: 'charisma',
          min: 30,
          failText: '全场不为所动。CEO 感谢你的"创意意见"，然后继续。',
          failScene: 'ending_bad',
        },
        setFlag: 'bold_success',
        narrative: '你满怀激情和数据，阐述你的愿景。',
      },
    ],
  },

  ending_good: {
    id: 'ending_good',
    location: 'MegaCorp 总部',
    title: '新星升起',
    description: `汇报结束。片刻沉默。然后 CEO 笑了。"表现不错。特别是第一天。"桌边的人纷纷点头。Todd 看起来如释重负——然后充满骄傲。回到格子间，Priya 起立为你鼓掌。你做到了。你留下了自己的印记。`,
    choices: [
      {
        id: 'good_final',
        text: '恭喜！你活过了第一天。',
        nextScene: 'ending_good',
        setFlag: 'ending_good',
        effects: { xp: 50, charisma: 10, productivity: 10, hp: 20 },
        narrative: '结局：',
      },
    ],
  },

  ending_victory: {
    id: 'ending_victory',
    location: '高管会议室',
    title: '远见者',
    description: `会议室里响起了议论声。CEO 站了起来。"这是我这整年听过最有创意的想法。"她看向 Todd。"我要这个人加入创新团队，立即生效。"Todd 点点头，震惊而高兴。你不只是活过了第一天——你改变了整个职业生涯的轨迹。`,
    choices: [
      {
        id: 'victory_final',
        text: '太传奇了。你第一天就被提拔了。',
        nextScene: 'ending_victory',
        setFlag: 'ending_victory',
        effects: { xp: 100, charisma: 15, productivity: 15, hp: 30 },
        narrative: '结局：',
      },
    ],
  },

  ending_neutral: {
    id: 'ending_neutral',
    location: 'MegaCorp 停车场',
    title: '又一个工作日',
    description: `你在下午 5 点准时收拾好东西。不算灾难，也不是辉煌。你做了该做的工作。你明天还会来，后天也会，最终这一切都会成为日常。办公室用温暖荧光的拥抱将你吞没。不是每一天都需要成为传奇。`,
    choices: [
      {
        id: 'neutral_final',
        text: '平平淡淡的第一天。明天见。',
        nextScene: 'ending_neutral',
        effects: { xp: 10 },
      },
    ],
  },

  ending_bad: {
    id: 'ending_bad',
    location: '人事部办公室',
    title: '离职面谈',
    description: `CEO 感谢你的时间。Todd 回避你的目光。一小时后，人事部递给你一个纸箱和一张遣散费支票。"不太合适。"你抱着纸箱走出 MegaCorp，不知道哪里出了问题。玻璃大厦在你身后矗立，冷漠如初。`,
    choices: [
      {
        id: 'bad_final',
        text: '游戏结束。再来一次？',
        nextScene: 'ending_bad',
        effects: { hp: -50, charisma: -10 },
      },
    ],
  },
};

export const START_SCENE = 'lobby';
