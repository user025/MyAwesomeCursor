const STORAGE_KEY = 'glm5_agentic_game_achievements_v2';

const MODE_PRESETS = {
  normal: {
    label: '标准模式',
    init: { R: 35, E: 30, L: 30, C: 12, N: 0, Y: 20, tokens: 1 }
  },
  hard: {
    label: '硬核模式',
    init: { R: 32, E: 28, L: 28, C: 9, N: 1, Y: 16, tokens: 0 }
  }
};

const SKILLS = [
  { id: 'glm5', name: 'GLM-5 异步编排', desc: '本节点同选项半效追加一次，并提升协同值。' },
  { id: 'glm47', name: 'GLM-4.7 版本回看', desc: '撤销上一回合，回到上一节点前状态。' },
  { id: 'deepseek', name: 'DeepSeek 稀疏预算', desc: '长上下文/注意力节点算力消耗 -2（可跨回合生效）。' },
  { id: 'claude', name: 'Claude 长程验收', desc: '若长程分>=40，工程分额外 +6。' },
  { id: 'gemini', name: 'Gemini 上下文预警', desc: '抵消一次噪声增长。' },
  { id: 'gpt', name: 'GPT-5.2 评测仲裁', desc: '下一次失败判定改为继续（代价噪声 +1）。' }
];

const ACHIEVEMENTS = [
  { id: 'first_clear', name: '首次发布', desc: '达成任一非 Bad 结局。' },
  { id: 'hcm_master', name: '上下文统治者', desc: '在节点7选择 HCM 方案。' },
  { id: 'sparse_ops', name: '稀疏调度员', desc: '至少触发一次 DeepSeek 减耗。' },
  { id: 'chip_pioneer', name: '芯片先行者', desc: '在节点9选择全栈国产芯片方案。' },
  { id: 'low_noise', name: '洁净发布', desc: '非 Bad 结局且最终噪声 <= 1。' },
  { id: 'hard_clear', name: '硬核通关', desc: '在硬核模式达成非 Bad 结局。' },
  { id: 'hidden_resonance', name: '隐藏·全栈共振', desc: '达成隐藏结局“全栈共振”。' },
  { id: 'hidden_mirage', name: '隐藏·镜花水月', desc: '达成隐藏结局“镜花水月”。' }
];

const LONG_CONTEXT_NODES = new Set([2, 3, 7]);
const EVENT_TRIGGER_NODES = new Set([2, 4, 6, 8]);

const NODES = [
  {
    id: 1,
    title: '目标定义',
    section: 'S1 Results',
    scene: '你们要定义第一阶段发布目标。',
    fact: '报告覆盖了 8 项 ARC 基准，并指出 GLM-5 相比 GLM-4.7 平均约提升 20%。',
    options: [
      { key: 'A', text: '同时追踪 8 项 ARC 指标', delta: { R: 8, E: 4, L: 4, C: -2, N: 0, Y: 5 }, tag: 'n1A' },
      { key: 'B', text: '只冲静态榜单，不建真实工程闭环', delta: { R: 6, E: -3, L: -2, C: -1, N: 1, Y: -3 }, tag: 'n1B' },
      { key: 'C', text: '只做内部体验，不做公开基准对齐', delta: { R: 2, E: 7, L: 2, C: -2, N: 0, Y: 2 }, tag: 'n1C' }
    ],
    quotes: [
      'GLM-5：先定义胜利条件，再谈工程路径。',
      'Claude：真实可交付，比单点分数更难也更重要。',
      'GPT-5.2：评测目标必须可复现，否则结论不可比较。'
    ]
  },
  {
    id: 2,
    title: '架构选择',
    section: 'S2.1 / S2.1.1',
    scene: '你需要决定是否采用 DSA + 大规模 MoE。',
    fact: '报告给出 744B 总参数 / 40B 激活，256 experts，80 layers，并采用 DSA。',
    options: [
      { key: 'A', text: '采用 DSA，落地 744B/40B、256 experts、80 layers', delta: { R: 10, E: 5, L: 4, C: 1, N: 0, Y: 6 }, tag: 'n2A' },
      { key: 'B', text: '维持密集注意力路线', delta: { R: 4, E: 1, L: -2, C: -4, N: 1, Y: -3 }, tag: 'n2B' },
      { key: 'C', text: '保守保持旧规模（类 355B/32B 档位）', delta: { R: 3, E: 2, L: -3, C: 2, N: 0, Y: -1 }, tag: 'n2C' }
    ],
    quotes: [
      'DeepSeek：稀疏不是减配，是把算力押在重要 token 上。',
      'GLM-4.7：旧方案稳定，但天花板也清晰可见。'
    ]
  },
  {
    id: 3,
    title: '中训窗口',
    section: 'S2.3',
    scene: '上下文是否按三阶段推进？',
    fact: '报告中训阶段为 32K(1T) -> 128K(500B) -> 200K(50B)。',
    options: [
      { key: 'A', text: '按 32K->128K->200K 三阶段推进', delta: { R: 6, E: 3, L: 10, C: -2, N: 0, Y: 6 }, tag: 'n3A' },
      { key: 'B', text: '停在 128K', delta: { R: 3, E: 2, L: 4, C: 1, N: 0, Y: 1 }, tag: 'n3B' },
      { key: 'C', text: '直接冲 200K（无分阶段缓冲）', delta: { R: 5, E: 1, L: 6, C: -3, N: 1, Y: -2 }, tag: 'n3C' }
    ],
    quotes: [
      'Gemini：窗口越长，管理越关键，不只是堆 token。',
      'Claude：渐进式扩展能显著降低工程爆雷概率。'
    ]
  },
  {
    id: 4,
    title: '后训练管线',
    section: 'S1 Methods / S3',
    scene: '你如何排布 SFT 与 RL？',
    fact: '报告采用 SFT -> Reasoning RL -> Agentic RL -> General RL，并结合跨阶段蒸馏。',
    options: [
      { key: 'A', text: '完整路线 + On-Policy Cross-Stage Distillation', delta: { R: 9, E: 8, L: 6, C: -2, N: 0, Y: 7 }, tag: 'n4A' },
      { key: 'B', text: '不做跨阶段蒸馏', delta: { R: 6, E: 2, L: -2, C: -1, N: 1, Y: -2 }, tag: 'n4B' },
      { key: 'C', text: '仅强化 SFT，缩减 RL', delta: { R: 2, E: -3, L: -1, C: 2, N: 0, Y: -2 }, tag: 'n4C' }
    ],
    quotes: [
      'GLM-5：顺序 RL 管线是能力迁移，不是一次性堆数据。',
      'GPT-5.2：跨阶段蒸馏能显著降低能力回退风险。'
    ]
  },
  {
    id: 5,
    title: '异步 RL 稳定性',
    section: 'S4.1.2',
    scene: '出现离策略样本、环境崩溃噪声、KV 复用效率问题。',
    fact: '报告强调双侧 token clipping、off-policy 样本过滤、环境故障样本剔除与 DP-aware routing。',
    options: [
      { key: 'A', text: '双侧 clipping + off-policy 过滤 + 故障样本剔除', delta: { R: 5, E: 10, L: 5, C: -1, N: 0, Y: 7 }, tag: 'n5A' },
      { key: 'B', text: '只保吞吐，不做样本清洗', delta: { R: 2, E: -6, L: -4, C: 2, N: 1, Y: -4 }, tag: 'n5B' },
      { key: 'C', text: '上 DP-aware routing，保持 KV 局部性', delta: { R: 4, E: 6, L: 4, C: 1, N: 0, Y: 4 }, tag: 'n5C' }
    ],
    quotes: [
      'Claude：没有稳定性的高吞吐，最终会在真实任务里偿还。',
      'DeepSeek：KV 局部性是长程效率的地基。'
    ]
  },
  {
    id: 6,
    title: '环境扩张',
    section: 'S4.2.1 / S4.2.2 / S4.2.3',
    scene: '你要优先扩张哪类可验证环境？',
    fact: 'SWE 10k+ 可验证环境（9 语言）；Terminal Docker 构建准确率 >90%；Search 使用 200 万+网页构建 WKG。',
    options: [
      { key: 'A', text: '优先 SWE 环境（10k+，9 语言）', delta: { R: 4, E: 10, L: 2, C: -1, N: 0, Y: 4 }, tag: 'n6A' },
      { key: 'B', text: '优先 Terminal（Harbor + Docker）', delta: { R: 5, E: 8, L: 3, C: -1, N: 0, Y: 5 }, tag: 'n6B' },
      { key: 'C', text: '优先 Search（WKG + 三阶段验证）', delta: { R: 4, E: 6, L: 8, C: -2, N: 0, Y: 6 }, tag: 'n6C' }
    ],
    quotes: [
      'GLM-4.7：从“会答题”到“会做事”，关键是可执行环境。',
      'Gemini：多源证据链能把搜索代理从检索推进到推理。'
    ]
  },
  {
    id: 7,
    title: '上下文管理',
    section: 'S4.2.4',
    scene: 'BrowseComp 进入长轨迹区，准确率开始下滑。',
    fact: 'keep-recent-k（k=5）将 55.3% 提升到 62.0%；HCM（T=32k）最终达到 75.9。',
    options: [
      { key: 'A', text: '不做管理，硬堆预算', delta: { R: 1, E: -2, L: -8, C: -3, N: 1, Y: -5 }, tag: 'n7A' },
      { key: 'B', text: 'keep-recent-k（k=5）', delta: { R: 4, E: 5, L: 7, C: 1, N: 0, Y: 6 }, tag: 'n7B' },
      { key: 'C', text: 'HCM（keep-recent + Discard-all，T=32k）', delta: { R: 6, E: 7, L: 10, C: 1, N: 0, Y: 8 }, tag: 'n7C' }
    ],
    quotes: [
      'GLM-5：上下文治理不是压缩历史，而是保留决策密度。',
      'GPT-5.2：HCM 的意义是把推理步数换回来。'
    ]
  },
  {
    id: 8,
    title: '奖励黑客攻防',
    section: 'S4.2.5',
    scene: 'Slide 生成出现 reward hacking（截断、空白操纵等）。',
    fact: '三层奖励 + Rejection Sampling + Masking-based refinement 后，16:9 合规率从 40% 提升到 92%，总体胜率 67.5%。',
    options: [
      { key: 'A', text: '三层奖励 + RS + Masking 全套', delta: { R: 7, E: 9, L: 4, C: -1, N: 0, Y: 7 }, tag: 'n8A' },
      { key: 'B', text: '只做静态规则层', delta: { R: 3, E: -2, L: 1, C: 1, N: 1, Y: -3 }, tag: 'n8B' },
      { key: 'C', text: '只做 RS，不做 masking 修复', delta: { R: 5, E: 4, L: 2, C: -1, N: 0, Y: 2 }, tag: 'n8C' }
    ],
    quotes: [
      'Claude：没有反黑客机制，奖励函数会被“表演式优化”。',
      'Gemini：运行时渲染约束能有效防止伪优雅。'
    ]
  },
  {
    id: 9,
    title: '国产芯片落地',
    section: 'S5',
    scene: '最终发布前，是否推进中国芯片全栈适配？',
    fact: '报告描述了 7 家芯片平台适配，并给出 W4A8、内核融合、推理调度协同方案。',
    options: [
      { key: 'A', text: 'W4A8 + 内核融合 + 推理调度三件套全上', delta: { R: 6, E: 8, L: 3, C: 2, N: 0, Y: 7 }, tag: 'n9A' },
      { key: 'B', text: '只做量化，不做内核与引擎协同', delta: { R: 3, E: 2, L: 1, C: 1, N: 1, Y: -2 }, tag: 'n9B' },
      { key: 'C', text: '延后适配，先跑国际硬件', delta: { R: 2, E: 1, L: 1, C: -2, N: 0, Y: -1 }, tag: 'n9C' }
    ],
    quotes: [
      'GLM-5：全栈适配不是“可运行”，而是“可规模化运行”。',
      'DeepSeek：硬件共设决定了真实部署上限。'
    ]
  }
];

const EVENT_POOL = [
  {
    id: 'judge_bias',
    title: '突发事件：评测偏置警报',
    section: 'S4.2.4',
    text: '团队发现 BrowseComp 结果受 judge prompt/model 影响明显。',
    fact: '报告将 judge 组件统一并强调可复现评测设置。',
    options: [
      { key: 'A', text: '统一评测协议并锁定 judge 版本', delta: { E: 6, L: 3, C: -1, Y: 5 } },
      { key: 'B', text: '继续混用评测脚本以追求速度', delta: { R: 3, E: -3, N: 1, Y: -3 } }
    ],
    quote: 'GPT-5.2：同题不同裁判，分数可比性会崩。'
  },
  {
    id: 'sandbox_crash',
    title: '突发事件：沙箱崩溃潮',
    section: 'S4.1.2',
    text: '编码代理环境发生批量崩溃，噪声样本激增。',
    fact: '报告建议记录失败原因并剔除环境崩溃导致的噪声样本。',
    options: [
      { key: 'A', text: '剔除环境崩溃样本并重建分组', delta: { E: 7, C: -1, Y: 4 } },
      { key: 'B', text: '不清洗，保持吞吐优先', delta: { R: 3, E: -4, N: 1, Y: -2 } }
    ],
    quote: 'Claude：吞吐快不代表信号干净。'
  },
  {
    id: 'distill_rehearsal',
    title: '突发事件：蒸馏回放窗口',
    section: 'S1 Methods / S3',
    text: '你拿到一个短暂窗口，可做跨阶段回放蒸馏。',
    fact: '报告强调跨阶段蒸馏用于缓解能力回退。',
    options: [
      { key: 'A', text: '立即执行回放蒸馏，并恢复 1 个已用技能', delta: { R: 4, E: 4, C: -1, Y: 6 }, reward: { refreshSkill: true } },
      { key: 'B', text: '放弃窗口，维持当前节奏', delta: { R: 2, C: 1, Y: -1 } }
    ],
    quote: 'GLM-4.7：能回放就回放，别让新能力冲掉旧优势。'
  },
  {
    id: 'harbor_validation',
    title: '突发事件：Terminal 任务质检',
    section: 'S4.2.2',
    text: 'Harbor 验证脚本对一批任务给出失败信号。',
    fact: '报告使用“构建代理自检闭环”，仅保留通过自动检查的任务。',
    options: [
      { key: 'A', text: '进入自检闭环直到全量通过', delta: { E: 5, L: 2, C: -1, Y: 4, tokens: 1 } },
      { key: 'B', text: '跳过验证直接入池', delta: { R: 3, E: -4, N: 1, Y: -3 } }
    ],
    quote: 'GLM-5：可验证，才可规模化。'
  },
  {
    id: 'hcm_threshold',
    title: '突发事件：上下文爆仓',
    section: 'S4.2.4',
    text: '工具调用历史突然暴涨，历史轨迹接近失控。',
    fact: '报告给出 HCM：keep-recent + Discard-all，并通过 T=32k 进行搜索。',
    options: [
      { key: 'A', text: '直接启用 HCM 阈值策略', delta: { E: 4, L: 6, C: 1, Y: 5 } },
      { key: 'B', text: '保留全历史，等预算兜底', delta: { L: -4, C: -2, N: 1, Y: -3 } }
    ],
    quote: 'DeepSeek：历史不是越多越好，关键是信息密度。'
  },
  {
    id: 'slide_hack',
    title: '突发事件：奖励黑客复现',
    section: 'S4.2.5',
    text: '模型开始通过空白填充和截断来刷“漂亮分”。',
    fact: '报告中通过运行时渲染约束和多层奖励抑制 reward hacking。',
    options: [
      { key: 'A', text: '上线运行时渲染约束并审计异常布局', delta: { E: 5, L: 3, C: -1, Y: 4 } },
      { key: 'B', text: '先不处理，继续扩充样本', delta: { R: 2, E: -3, N: 1, Y: -2 } }
    ],
    quote: 'Gemini：漂亮不等于正确，几何作弊很隐蔽。'
  }
];

let achievements = loadAchievements();
let selectedSkillId = null;
let state = createEmptyState();

const modePanel = document.getElementById('modePanel');
const statusPanel = document.getElementById('statusPanel');
const skillsPanel = document.getElementById('skillsPanel');
const eventPanel = document.getElementById('eventPanel');
const nodePanel = document.getElementById('nodePanel');
const quoteBox = document.getElementById('quoteBox');
const logList = document.getElementById('logList');
const progress = document.getElementById('progress');
const achievementList = document.getElementById('achievementList');

bindModeEvents();

render();

function createEmptyState() {
  return {
    mode: null,
    R: 0,
    E: 0,
    L: 0,
    C: 0,
    N: 0,
    Y: 0,
    tokens: 0,
    nodeIndex: 0,
    event: null,
    usedEvents: [],
    ended: false,
    endTitle: '',
    endDesc: '',
    endTier: '',
    score: 0,
    selectedTags: [],
    usedSkills: {},
    pending: {
      deepseekCostDiscount: false,
      geminiNoiseShield: false,
      gptArbitration: false
    },
    stats: {
      deepseekDiscountCount: 0
    },
    logs: [],
    history: []
  };
}

function startGame(mode) {
  const preset = MODE_PRESETS[mode];
  if (!preset) return;
  state = createEmptyState();
  state.mode = mode;
  state.R = preset.init.R;
  state.E = preset.init.E;
  state.L = preset.init.L;
  state.C = preset.init.C;
  state.N = preset.init.N;
  state.Y = preset.init.Y;
  state.tokens = preset.init.tokens;
  state.logs.push(`已开始 ${preset.label}。`);
  state.logs.push('目标：在保证可复现与可交付的前提下完成 Agentic 发布。');
  selectedSkillId = null;
  setQuote(mode === 'hard'
    ? 'GLM-5：硬核模式已启动，任何噪声都可能放大成系统风险。'
    : 'GLM-5：标准模式已启动，先稳住工程节奏。');
  render();
}

function bindModeEvents() {
  modePanel.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-mode]');
    if (!btn) return;
    const mode = btn.getAttribute('data-mode');
    startGame(mode);
  });
}

function loadAchievements() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function saveAchievements() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
}

function unlockAchievement(id) {
  if (!id || achievements[id]) return;
  achievements[id] = true;
  saveAchievements();
  const meta = ACHIEVEMENTS.find((a) => a.id === id);
  if (meta) {
    state.logs.push(`🏅 解锁成就：${meta.name}`);
  }
}

function renderAchievements() {
  achievementList.innerHTML = ACHIEVEMENTS.map((a) => {
    const unlocked = !!achievements[a.id];
    return `
      <div class="achievement ${unlocked ? 'unlocked' : ''}">
        <div class="achievement-title">${unlocked ? '🏅' : '🔒'} ${escapeHtml(a.name)}</div>
        <div class="achievement-desc">${escapeHtml(a.desc)}</div>
      </div>
    `;
  }).join('');
}

function cloneSnapshot() {
  return {
    R: state.R,
    E: state.E,
    L: state.L,
    C: state.C,
    N: state.N,
    Y: state.Y,
    tokens: state.tokens,
    nodeIndex: state.nodeIndex,
    selectedTags: [...state.selectedTags],
    pending: { ...state.pending },
    usedSkills: { ...state.usedSkills },
    usedEvents: [...state.usedEvents],
    stats: { ...state.stats }
  };
}

function applyDelta(delta, ratio = 1) {
  state.R += Math.trunc((delta.R || 0) * ratio);
  state.E += Math.trunc((delta.E || 0) * ratio);
  state.L += Math.trunc((delta.L || 0) * ratio);
  state.C += Math.trunc((delta.C || 0) * ratio);
  state.N += Math.trunc((delta.N || 0) * ratio);
  state.Y += Math.trunc((delta.Y || 0) * ratio);
  state.tokens += Math.trunc((delta.tokens || 0) * ratio);
  if (state.N < 0) state.N = 0;
  if (state.tokens < 0) state.tokens = 0;
}

function refreshRandomSkill() {
  const used = Object.keys(state.usedSkills).filter((k) => state.usedSkills[k]);
  if (!used.length) return false;
  const target = used[Math.floor(Math.random() * used.length)];
  state.usedSkills[target] = false;
  state.logs.push(`蒸馏回放生效：技能【${getSkillName(target)}】已恢复可用。`);
  return true;
}

function getSkillName(id) {
  const skill = SKILLS.find((s) => s.id === id);
  return skill ? skill.name : id;
}

function selectSkill(skillId) {
  if (!state.mode || state.ended || state.event) return;
  if (state.usedSkills[skillId]) return;
  selectedSkillId = selectedSkillId === skillId ? null : skillId;
  if (selectedSkillId) {
    setQuote(`你已选中技能：${getSkillName(selectedSkillId)}。`);
  }
  render();
}

function getFailureReason() {
  if (state.C < 0) return '算力预算透支（C < 0）';
  if (state.N >= 4) return '噪声过高（N >= 4）';
  if (state.R <= 0) return '研发分耗尽（R <= 0）';
  if (state.E <= 0) return '工程分耗尽（E <= 0）';
  if (state.L <= 0) return '长程分耗尽（L <= 0）';
  return '';
}

function tryArbitrateFailure(reason) {
  if (!reason || !state.pending.gptArbitration) return reason;
  state.pending.gptArbitration = false;
  state.N += 1;
  if (state.C < 0) state.C = 0;
  if (state.R <= 0) state.R = 1;
  if (state.E <= 0) state.E = 1;
  if (state.L <= 0) state.L = 1;
  if (state.N >= 4) state.N = 3;
  state.logs.push('【GPT-5.2 评测仲裁】触发：本次失败改判为继续，代价噪声 +1。');
  setQuote('GPT-5.2：我先把你从失败线拉回来，但下一次别再赌运气。');
  return '';
}

function evaluateAndFinishIfNeeded() {
  let failure = getFailureReason();
  failure = tryArbitrateFailure(failure);
  if (failure) {
    state.ended = true;
    state.endTier = 'BAD';
    state.endTitle = 'Bad End《回归到 Vibe Coding》';
    state.endDesc = `失败原因：${failure}`;
    state.score = state.R + state.E + state.L + 2 * state.C + state.Y - 8 * state.N;
    setQuote('GLM-4.7：你失去了工程闭环，系统退回到不可控试错。');
    return true;
  }
  if (state.nodeIndex >= NODES.length) {
    finishGame();
    return true;
  }
  return false;
}

function finishGame() {
  const keyTechDone = state.selectedTags.includes('n2A')
    && (state.selectedTags.includes('n7B') || state.selectedTags.includes('n7C'))
    && state.selectedTags.includes('n8A');
  const score = state.R + state.E + state.L + 2 * state.C + state.Y - 8 * state.N;
  state.score = score;

  let title = 'C End《继续迭代》';
  let desc = '你完成了实验性发布，但关键路径尚未闭环。';
  let tier = 'C';

  if (score >= 240 && keyTechDone && state.Y >= 70 && state.mode === 'hard' && state.N <= 1) {
    title = 'X End《全栈共振》';
    desc = '你在硬核压力下完成了 DSA、HCM、反奖励黑客与芯片协同的全链路共振。';
    tier = 'X1';
  } else if (state.R >= 95 && state.E < 48 && state.L < 45) {
    title = 'X End《镜花水月》';
    desc = '你拿到了惊艳分数，却在工程与长程一致性上留下致命裂缝。';
    tier = 'X2';
  } else if (score >= 210 && keyTechDone && state.Y >= 60) {
    title = 'S End《Agentic Engineering 成形》';
    desc = '你完成了关键技术闭环，系统具备稳定交付与持续优化能力。';
    tier = 'S';
  } else if (score >= 175) {
    title = 'A End《可发布工程体》';
    desc = '系统达到可发布标准，工程质量与效率较平衡。';
    tier = 'A';
  } else if (score >= 145) {
    title = 'B End《榜单可见，工程待补》';
    desc = '公开基准表现尚可，但复杂场景仍有风险。';
    tier = 'B';
  }

  state.ended = true;
  state.endTier = tier;
  state.endTitle = title;
  state.endDesc = `${desc}（总分：${score}）`;
  setQuote('GLM-5：发布窗口已关闭，开始复盘。');

  if (tier !== 'BAD') unlockAchievement('first_clear');
  if (state.selectedTags.includes('n7C')) unlockAchievement('hcm_master');
  if (state.stats.deepseekDiscountCount >= 1) unlockAchievement('sparse_ops');
  if (state.selectedTags.includes('n9A')) unlockAchievement('chip_pioneer');
  if (tier !== 'BAD' && state.N <= 1) unlockAchievement('low_noise');
  if (tier !== 'BAD' && state.mode === 'hard') unlockAchievement('hard_clear');
  if (tier === 'X1') unlockAchievement('hidden_resonance');
  if (tier === 'X2') unlockAchievement('hidden_mirage');
}

function maybeTriggerEvent(lastNodeId) {
  if (!EVENT_TRIGGER_NODES.has(lastNodeId)) return;
  const available = EVENT_POOL.filter((e) => !state.usedEvents.includes(e.id));
  if (!available.length) return;

  const event = available[Math.floor(Math.random() * available.length)];
  state.event = event;
  state.usedEvents.push(event.id);
  state.logs.push(`触发事件：${event.title}`);
  setQuote(event.quote);
}

function resolveEvent(optionKey) {
  if (!state.event || state.ended) return;
  const ev = state.event;
  const option = ev.options.find((o) => o.key === optionKey);
  if (!option) return;

  const preNoise = state.N;
  applyDelta(option.delta || {});

  if (state.pending.geminiNoiseShield && state.N > preNoise) {
    state.N -= 1;
    state.pending.geminiNoiseShield = false;
    state.logs.push('Gemini 上下文预警生效：已抵消事件噪声 +1。');
  }

  if (option.reward && option.reward.refreshSkill) {
    refreshRandomSkill();
  }

  state.logs.push(`事件选择 ${option.key}：${option.text}`);
  state.event = null;
  selectedSkillId = null;

  evaluateAndFinishIfNeeded();
  render();
}

function rerollEvent() {
  if (!state.event || state.tokens <= 0 || state.ended) return;
  const available = EVENT_POOL.filter((e) => !state.usedEvents.includes(e.id));
  if (!available.length) {
    state.logs.push('复盘令牌使用失败：没有可重抽的新事件。');
    render();
    return;
  }
  state.tokens -= 1;
  const next = available[Math.floor(Math.random() * available.length)];
  state.usedEvents.push(next.id);
  state.logs.push(`使用复盘令牌：事件【${state.event.title}】被重抽为【${next.title}】。`);
  state.event = next;
  setQuote(next.quote);
  render();
}

function applyChoice(option) {
  if (!state.mode || state.ended || state.event) return;
  const node = NODES[state.nodeIndex];
  if (!node) return;
  const skillId = selectedSkillId;

  state.history.push(cloneSnapshot());
  const preNoise = state.N;
  const baseDelta = { ...option.delta };

  if (skillId && !state.usedSkills[skillId]) {
    if (skillId === 'glm47') {
      const prev = state.history[state.history.length - 2];
      state.usedSkills[skillId] = true;
      selectedSkillId = null;
      if (prev) {
        state.R = prev.R;
        state.E = prev.E;
        state.L = prev.L;
        state.C = prev.C;
        state.N = prev.N;
        state.Y = prev.Y;
        state.tokens = prev.tokens;
        state.nodeIndex = prev.nodeIndex;
        state.selectedTags = [...prev.selectedTags];
        state.pending = { ...prev.pending };
        state.usedEvents = [...prev.usedEvents];
        state.stats = { ...prev.stats };
        state.logs.push('使用技能【GLM-4.7 版本回看】：已撤销上一回合。');
        setQuote('GLM-4.7：我把你拉回安全线，重新选。');
      } else {
        state.logs.push('使用技能【GLM-4.7 版本回看】失败：当前没有可撤销的上一回合。');
      }
      render();
      return;
    }

    if (skillId === 'deepseek') {
      state.usedSkills[skillId] = true;
      if (LONG_CONTEXT_NODES.has(node.id) && baseDelta.C < 0) {
        baseDelta.C += 2;
        baseDelta.Y = (baseDelta.Y || 0) + 4;
        state.stats.deepseekDiscountCount += 1;
        state.logs.push('DeepSeek 稀疏预算生效：本节点算力消耗 -2。');
        setQuote('DeepSeek：削掉的是冗余，不是有效推理。');
      } else {
        state.pending.deepseekCostDiscount = true;
        state.logs.push('DeepSeek 稀疏预算已挂载：将作用于后续长上下文节点。');
      }
      selectedSkillId = null;
    } else if (skillId === 'gemini') {
      state.usedSkills[skillId] = true;
      state.pending.geminiNoiseShield = true;
      selectedSkillId = null;
      state.logs.push('Gemini 上下文预警已就位：下一次噪声增长将被抵消。');
    } else if (skillId === 'gpt') {
      state.usedSkills[skillId] = true;
      state.pending.gptArbitration = true;
      selectedSkillId = null;
      state.logs.push('GPT-5.2 评测仲裁已激活：下一次失败可改判继续。');
    }
  }

  if (state.pending.deepseekCostDiscount && LONG_CONTEXT_NODES.has(node.id) && baseDelta.C < 0) {
    baseDelta.C += 2;
    state.pending.deepseekCostDiscount = false;
    state.stats.deepseekDiscountCount += 1;
    state.logs.push('挂载的 DeepSeek 减耗已触发：本节点算力消耗 -2。');
  }

  applyDelta(baseDelta);

  if (skillId === 'glm5' && !state.usedSkills.glm5) {
    state.usedSkills.glm5 = true;
    applyDelta(baseDelta, 0.5);
    state.Y += 4;
    selectedSkillId = null;
    state.logs.push('GLM-5 异步编排生效：同选项半效追加执行。');
    setQuote('GLM-5：并发推进，节拍翻倍。');
  } else if (skillId === 'claude' && !state.usedSkills.claude) {
    state.usedSkills.claude = true;
    selectedSkillId = null;
    if (state.L >= 40) {
      state.E += 6;
      state.Y += 3;
      state.logs.push('Claude 长程验收通过：工程分 +6。');
      setQuote('Claude：长程链条完整，准许放行。');
    } else {
      state.Y += 1;
      state.logs.push('Claude 长程验收：长程分不足 40，仅提供轻量建议。');
      setQuote('Claude：还差一点长程证据，先保守推进。');
    }
  } else if (!skillId) {
    setQuote(randomFrom(node.quotes));
  }

  if (state.pending.geminiNoiseShield && state.N > preNoise) {
    state.N -= 1;
    state.pending.geminiNoiseShield = false;
    state.logs.push('Gemini 上下文预警生效：已抵消本轮噪声 +1。');
  }

  state.selectedTags.push(option.tag);
  state.logs.push(`节点${node.id} 选择 ${option.key}：${option.text}`);

  state.nodeIndex += 1;
  const endedNow = evaluateAndFinishIfNeeded();
  if (!endedNow) {
    maybeTriggerEvent(node.id);
  }
  render();
}

function resetCurrentMode() {
  if (!state.mode) return;
  startGame(state.mode);
}

function backToModeSelect() {
  state = createEmptyState();
  selectedSkillId = null;
  setQuote('请选择模式开始游戏。');
  render();
}

function renderModePanel() {
  modePanel.querySelectorAll('[data-mode]').forEach((btn) => {
    const mode = btn.getAttribute('data-mode');
    btn.classList.toggle('active', state.mode === mode);
  });
}

function renderStatus() {
  if (!state.mode) {
    statusPanel.innerHTML = '<div class="empty-tip">请选择开局模式后，状态面板将显示实时资源变化。</div>';
    return;
  }

  statusPanel.innerHTML = [
    metricCard('研发分 R', state.R, 120, false),
    metricCard('工程分 E', state.E, 120, false),
    metricCard('长程分 L', state.L, 120, false),
    metricCard('算力预算 C', state.C, 20, false),
    metricCard('噪声 N', state.N, 4, true),
    metricCard('协同值 Y', state.Y, 100, false),
    metricCard('复盘令牌', state.tokens, 3, false)
  ].join('');
}

function metricCard(name, value, max, invert) {
  const v = Math.max(0, value);
  const ratio = Math.max(0, Math.min(100, (v / max) * 100));
  const width = invert ? 100 - ratio : ratio;
  return `
    <div class="metric">
      <span>${escapeHtml(name)}</span>
      <strong>${value}</strong>
      <div class="meter"><i style="width:${width}%"></i></div>
    </div>
  `;
}

function renderSkills() {
  if (!state.mode) {
    skillsPanel.innerHTML = '<div class="empty-tip">开局后可选择技能。每位队友仅能出手一次。</div>';
    return;
  }
  if (state.event) {
    skillsPanel.innerHTML = '<div class="empty-tip">当前正在处理突发事件，技能暂不可用。</div>';
    return;
  }
  skillsPanel.innerHTML = SKILLS.map((skill) => {
    const used = !!state.usedSkills[skill.id];
    const active = selectedSkillId === skill.id;
    return `
      <button class="skill ${active ? 'active' : ''} ${used ? 'used' : ''}" data-skill-id="${skill.id}" ${used ? 'disabled' : ''}>
        <span class="skill-name">${escapeHtml(skill.name)}</span>
        <span class="skill-desc">${escapeHtml(skill.desc)}</span>
      </button>
    `;
  }).join('');

  skillsPanel.querySelectorAll('[data-skill-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const skillId = btn.getAttribute('data-skill-id');
      if (skillId) selectSkill(skillId);
    });
  });
}

function renderEventPanel() {
  if (!state.mode || !state.event || state.ended) {
    eventPanel.classList.add('hidden');
    eventPanel.innerHTML = '';
    return;
  }
  const ev = state.event;
  eventPanel.classList.remove('hidden');
  eventPanel.innerHTML = `
    <h2>${escapeHtml(ev.title)}</h2>
    <p class="section">章节依据：${escapeHtml(ev.section)}</p>
    <p>${escapeHtml(ev.text)}</p>
    <div class="fact-card"><strong>报告事实卡：</strong>${escapeHtml(ev.fact)}</div>
    <div class="options">
      ${ev.options.map((opt) => `<button class="option-btn event-btn" data-event-opt="${opt.key}">${opt.key}. ${escapeHtml(opt.text)}</button>`).join('')}
    </div>
    <div class="event-actions">
      <button class="reroll-btn" id="rerollEventBtn" ${state.tokens <= 0 ? 'disabled' : ''}>
        使用复盘令牌重抽事件（剩余 ${state.tokens}）
      </button>
    </div>
  `;
  eventPanel.querySelectorAll('[data-event-opt]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-event-opt');
      if (key) resolveEvent(key);
    });
  });
  const rerollBtn = document.getElementById('rerollEventBtn');
  rerollBtn?.addEventListener('click', rerollEvent);
}

function renderNode() {
  if (!state.mode) {
    progress.textContent = '未开始';
    nodePanel.innerHTML = `
      <h2>准备就绪</h2>
      <p>请选择“标准模式”或“硬核模式”开始远征。</p>
    `;
    return;
  }

  const totalNodes = NODES.length;
  const step = Math.min(state.nodeIndex + 1, totalNodes);
  const modeLabel = MODE_PRESETS[state.mode].label;
  progress.textContent = state.ended
    ? `已结局 · ${modeLabel}`
    : `进度：节点 ${step} / ${totalNodes} · ${modeLabel}`;

  if (state.ended) {
    nodePanel.innerHTML = `
      <h2>${escapeHtml(state.endTitle)}</h2>
      <p>${escapeHtml(state.endDesc)}</p>
      <p class="battle-report">战报：R=${state.R} / E=${state.E} / L=${state.L} / C=${state.C} / N=${state.N} / Y=${state.Y}</p>
      <div class="options end-actions">
        <button class="restart-btn" id="restartBtn">同模式再开一局</button>
        <button class="restart-btn" id="backModeBtn">返回模式选择</button>
      </div>
    `;
    document.getElementById('restartBtn')?.addEventListener('click', resetCurrentMode);
    document.getElementById('backModeBtn')?.addEventListener('click', backToModeSelect);
    return;
  }

  const node = NODES[state.nodeIndex];
  if (!node) return;

  const lockHint = state.event ? '<p class="warn-tip">请先处理上方突发事件，再继续主线节点。</p>' : '';
  nodePanel.innerHTML = `
    <h2>节点 ${node.id}：${escapeHtml(node.title)}</h2>
    <p class="section">章节依据：${escapeHtml(node.section)}</p>
    <p>${escapeHtml(node.scene)}</p>
    <div class="fact-card"><strong>报告事实卡：</strong>${escapeHtml(node.fact)}</div>
    ${lockHint}
    <div class="options">
      ${node.options.map((opt) =>
        `<button class="option-btn" data-opt-key="${opt.key}" ${state.event ? 'disabled' : ''}>
          <span class="opt-main">${opt.key}. ${escapeHtml(opt.text)}</span>
        </button>`).join('')}
    </div>
  `;
  node.options.forEach((opt) => {
    const btn = nodePanel.querySelector(`[data-opt-key="${opt.key}"]`);
    btn?.addEventListener('click', () => applyChoice(opt));
  });
}

function renderLogs() {
  const lines = state.logs.slice(-12).reverse();
  logList.innerHTML = lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
}

function setQuote(text) {
  quoteBox.textContent = text || '...';
}

function randomFrom(list) {
  if (!list || !list.length) return '';
  return list[Math.floor(Math.random() * list.length)];
}

function render() {
  renderModePanel();
  renderStatus();
  renderSkills();
  renderEventPanel();
  renderNode();
  renderLogs();
  renderAchievements();
}

function escapeHtml(input) {
  const text = String(input ?? '');
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
