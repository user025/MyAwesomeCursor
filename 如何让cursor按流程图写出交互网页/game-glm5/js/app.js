const INITIAL_STATE = {
  R: 35,
  E: 30,
  L: 30,
  C: 12,
  N: 0,
  nodeIndex: 0,
  ended: false,
  endTitle: '',
  endDesc: '',
  selectedTags: [],
  usedSkills: {},
  pending: {
    deepseekCostDiscount: false,
    geminiNoiseShield: false,
    gptArbitration: false
  },
  logs: [],
  history: []
};

const LONG_CONTEXT_NODES = new Set([2, 3, 7]);

const SKILLS = [
  { id: 'glm5', name: 'GLM-5 异步编排', desc: '本节点追加一次“同选项半效执行”' },
  { id: 'glm47', name: 'GLM-4.7 版本回看', desc: '回退到上一节点前状态并重打' },
  { id: 'deepseek', name: 'DeepSeek 稀疏预算', desc: '下一次长上下文/注意力节点，算力消耗 -2' },
  { id: 'claude', name: 'Claude 长程验收', desc: '若长程分 >= 40，额外工程分 +6' },
  { id: 'gemini', name: 'Gemini 上下文预警', desc: '抵消下一次噪声 +1' },
  { id: 'gpt', name: 'GPT-5.2 评测仲裁', desc: '下一次失败判定改为继续（并追加噪声 +1）' }
];

const NODES = [
  {
    id: 1,
    title: '目标定义',
    section: 'S1 Results',
    scene: '你们要定义第一阶段发布目标。',
    fact: '报告对比了 8 项 ARC 基准，并提到 GLM-5 相比 GLM-4.7 平均约提升 20%。',
    options: [
      { key: 'A', text: '同时追踪 8 项 ARC 指标', delta: { R: 8, E: 4, L: 4, C: -2, N: 0 }, tag: 'n1A' },
      { key: 'B', text: '只冲静态榜单，不建真实工程闭环', delta: { R: 6, E: -3, L: -2, C: -1, N: 1 }, tag: 'n1B' },
      { key: 'C', text: '只做内部体验，不做公开基准对齐', delta: { R: 2, E: 7, L: 2, C: -2, N: 0 }, tag: 'n1C' }
    ]
  },
  {
    id: 2,
    title: '架构选择',
    section: 'S2.1 / S2.1.1',
    scene: '你需要决定是否采用 DSA + 大规模 MoE。',
    fact: 'GLM-5 采用 744B 总参数、40B 激活、256 experts、80 layers，并引入 DSA。',
    options: [
      { key: 'A', text: '采用 DSA，落地 744B/40B、256 experts、80 layers', delta: { R: 10, E: 5, L: 4, C: 1, N: 0 }, tag: 'n2A' },
      { key: 'B', text: '维持密集注意力路线', delta: { R: 4, E: 1, L: -2, C: -4, N: 1 }, tag: 'n2B' },
      { key: 'C', text: '保守保持旧规模（类 355B/32B 档位）', delta: { R: 3, E: 2, L: -3, C: 2, N: 0 }, tag: 'n2C' }
    ]
  },
  {
    id: 3,
    title: '中训窗口',
    section: 'S2.3',
    scene: '上下文是否按三阶段推进？',
    fact: '报告给出中训阶段 32K(1T) -> 128K(500B) -> 200K(50B)。',
    options: [
      { key: 'A', text: '按 32K->128K->200K 三阶段推进', delta: { R: 6, E: 3, L: 10, C: -2, N: 0 }, tag: 'n3A' },
      { key: 'B', text: '停在 128K', delta: { R: 3, E: 2, L: 4, C: 1, N: 0 }, tag: 'n3B' },
      { key: 'C', text: '直接冲 200K（无分阶段缓冲）', delta: { R: 5, E: 1, L: 6, C: -3, N: 1 }, tag: 'n3C' }
    ]
  },
  {
    id: 4,
    title: '后训练管线',
    section: 'S1 Methods / S3',
    scene: '你如何排布 SFT 与 RL？',
    fact: '报告路线为 SFT -> Reasoning RL -> Agentic RL -> General RL，并强调跨阶段蒸馏。',
    options: [
      { key: 'A', text: '完整路线 + On-Policy Cross-Stage Distillation', delta: { R: 9, E: 8, L: 6, C: -2, N: 0 }, tag: 'n4A' },
      { key: 'B', text: '不做跨阶段蒸馏', delta: { R: 6, E: 2, L: -2, C: -1, N: 1 }, tag: 'n4B' },
      { key: 'C', text: '仅强化 SFT，缩减 RL', delta: { R: 2, E: -3, L: -1, C: 2, N: 0 }, tag: 'n4C' }
    ]
  },
  {
    id: 5,
    title: '异步 RL 稳定性',
    section: 'S4.1.2',
    scene: '出现离策略样本、环境崩溃噪声、KV 复用效率问题。',
    fact: '报告强调双侧 clipping、off-policy 样本过滤、环境崩溃样本剔除与 DP-aware routing。',
    options: [
      { key: 'A', text: '双侧 clipping + off-policy 过滤 + 故障样本剔除', delta: { R: 5, E: 10, L: 5, C: -1, N: 0 }, tag: 'n5A' },
      { key: 'B', text: '只保吞吐，不做样本清洗', delta: { R: 2, E: -6, L: -4, C: 2, N: 1 }, tag: 'n5B' },
      { key: 'C', text: '上 DP-aware routing，保持 KV 局部性', delta: { R: 4, E: 6, L: 4, C: 1, N: 0 }, tag: 'n5C' }
    ]
  },
  {
    id: 6,
    title: '环境扩张',
    section: 'S4.2.1 / S4.2.2 / S4.2.3',
    scene: '你要优先扩张哪类可验证环境？',
    fact: 'SWE 10k+ 可验证环境（9 语言）；Terminal Docker 构建准确率 >90%；Search 使用 200 万+网页构建 WKG。',
    options: [
      { key: 'A', text: '优先 SWE 环境（10k+，9 语言）', delta: { R: 4, E: 10, L: 2, C: -1, N: 0 }, tag: 'n6A' },
      { key: 'B', text: '优先 Terminal（Harbor + Docker）', delta: { R: 5, E: 8, L: 3, C: -1, N: 0 }, tag: 'n6B' },
      { key: 'C', text: '优先 Search（WKG + 三阶段验证）', delta: { R: 4, E: 6, L: 8, C: -2, N: 0 }, tag: 'n6C' }
    ]
  },
  {
    id: 7,
    title: '上下文管理',
    section: 'S4.2.4',
    scene: 'BrowseComp 进入长轨迹区，准确率开始下滑。',
    fact: 'keep-recent-k（k=5）将 55.3% 提升到 62.0%；HCM（T=32k）最终达到 75.9。',
    options: [
      { key: 'A', text: '不做管理，硬堆预算', delta: { R: 1, E: -2, L: -8, C: -3, N: 1 }, tag: 'n7A' },
      { key: 'B', text: 'keep-recent-k（k=5）', delta: { R: 4, E: 5, L: 7, C: 1, N: 0 }, tag: 'n7B' },
      { key: 'C', text: 'HCM（keep-recent + Discard-all，T=32k）', delta: { R: 6, E: 7, L: 10, C: 1, N: 0 }, tag: 'n7C' }
    ]
  },
  {
    id: 8,
    title: '奖励黑客攻防',
    section: 'S4.2.5',
    scene: 'Slide 生成出现 reward hacking（截断、空白操纵等）。',
    fact: '三层奖励 + Rejection Sampling + Masking-based refinement 后，16:9 合规率从 40% 提升到 92%，总胜率 67.5%。',
    options: [
      { key: 'A', text: '三层奖励 + RS + Masking 全套', delta: { R: 7, E: 9, L: 4, C: -1, N: 0 }, tag: 'n8A' },
      { key: 'B', text: '只做静态规则层', delta: { R: 3, E: -2, L: 1, C: 1, N: 1 }, tag: 'n8B' },
      { key: 'C', text: '只做 RS，不做 masking 修复', delta: { R: 5, E: 4, L: 2, C: -1, N: 0 }, tag: 'n8C' }
    ]
  },
  {
    id: 9,
    title: '国产芯片落地',
    section: 'S5',
    scene: '最终发布前，是否推进中国芯片全栈适配？',
    fact: '报告描述 7 家芯片平台适配，并给出 W4A8、内核融合、推理引擎调度协同方案。',
    options: [
      { key: 'A', text: 'W4A8 + 内核融合 + 推理调度三件套全上', delta: { R: 6, E: 8, L: 3, C: 2, N: 0 }, tag: 'n9A' },
      { key: 'B', text: '只做量化，不做内核与引擎协同', delta: { R: 3, E: 2, L: 1, C: 1, N: 1 }, tag: 'n9B' },
      { key: 'C', text: '延后适配，先跑国际硬件', delta: { R: 2, E: 1, L: 1, C: -2, N: 0 }, tag: 'n9C' }
    ]
  }
];

let state = structuredClone(INITIAL_STATE);
let selectedSkillId = null;

const statusPanel = document.getElementById('statusPanel');
const skillsPanel = document.getElementById('skillsPanel');
const nodePanel = document.getElementById('nodePanel');
const logList = document.getElementById('logList');
const progress = document.getElementById('progress');

function cloneSnapshot() {
  return {
    R: state.R,
    E: state.E,
    L: state.L,
    C: state.C,
    N: state.N,
    nodeIndex: state.nodeIndex,
    selectedTags: [...state.selectedTags],
    pending: { ...state.pending }
  };
}

function applyDelta(delta, ratio = 1) {
  state.R += Math.trunc((delta.R || 0) * ratio);
  state.E += Math.trunc((delta.E || 0) * ratio);
  state.L += Math.trunc((delta.L || 0) * ratio);
  state.C += Math.trunc((delta.C || 0) * ratio);
  state.N += Math.trunc((delta.N || 0) * ratio);
}

function useSkill(skillId, option) {
  if (!skillId || state.usedSkills[skillId]) return '';
  let msg = '';

  if (skillId === 'glm47') {
    const prev = state.history[state.history.length - 1];
    if (!prev) return 'GLM-4.7 技能发动失败：当前没有可回退的上一节点。';
    state = {
      ...state,
      R: prev.R,
      E: prev.E,
      L: prev.L,
      C: prev.C,
      N: prev.N,
      nodeIndex: prev.nodeIndex,
      selectedTags: [...prev.selectedTags],
      pending: { ...prev.pending },
      usedSkills: { ...state.usedSkills, glm47: true },
      logs: [...state.logs, '使用技能【GLM-4.7 版本回看】：已回退到上一节点前状态。']
    };
    selectedSkillId = null;
    render();
    return '__replayed__';
  }

  if (skillId === 'glm5') {
    applyDelta(option.delta, 0.5);
    msg = '使用技能【GLM-5 异步编排】：同选项半效追加执行。';
  } else if (skillId === 'deepseek') {
    state.pending.deepseekCostDiscount = true;
    msg = '使用技能【DeepSeek 稀疏预算】：下一次长上下文/注意力节点算力消耗 -2。';
  } else if (skillId === 'claude') {
    if (state.L >= 40) {
      state.E += 6;
      msg = '使用技能【Claude 长程验收】：长程分达标，工程分 +6。';
    } else {
      msg = '使用技能【Claude 长程验收】：长程分不足 40，本次无加成。';
    }
  } else if (skillId === 'gemini') {
    state.pending.geminiNoiseShield = true;
    msg = '使用技能【Gemini 上下文预警】：将抵消下一次噪声 +1。';
  } else if (skillId === 'gpt') {
    state.pending.gptArbitration = true;
    msg = '使用技能【GPT-5.2 评测仲裁】：下一次失败判定可改为继续。';
  }

  state.usedSkills[skillId] = true;
  selectedSkillId = null;
  return msg;
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
  state.logs.push('【GPT-5.2 评测仲裁】触发：本次失败改判为继续，代价是噪声 +1。');
  return '';
}

function finishGame() {
  const keyTechDone = state.selectedTags.includes('n2A') &&
    (state.selectedTags.includes('n7B') || state.selectedTags.includes('n7C')) &&
    state.selectedTags.includes('n8A');
  const total = state.R + state.E + state.L + 2 * state.C - 8 * state.N;

  let title = 'C End《继续迭代》';
  let desc = '你完成了实验性发布，但仍需在关键技术路径上补齐闭环。';

  if (total >= 190 && keyTechDone) {
    title = 'S End《Agentic Engineering 成形》';
    desc = '你达成了关键技术闭环：DSA 主路线 + 上下文管理 + 反奖励黑客机制。';
  } else if (total >= 160) {
    title = 'A End《可发布工程体》';
    desc = '系统达到可发布标准，在工程与长程任务上具备稳定表现。';
  } else if (total >= 130) {
    title = 'B End《榜单可见，工程待补》';
    desc = '基准表现可见，但在真实复杂环境中仍有稳定性与可运维短板。';
  }

  state.ended = true;
  state.endTitle = title;
  state.endDesc = `${desc}（总分：${total}）`;
}

function selectSkill(skillId) {
  if (state.usedSkills[skillId]) return;
  selectedSkillId = selectedSkillId === skillId ? null : skillId;
  render();
}

function applyChoice(option) {
  if (state.ended) return;
  const node = NODES[state.nodeIndex];
  const preNoise = state.N;
  state.history.push(cloneSnapshot());

  let delta = { ...option.delta };
  if (state.pending.deepseekCostDiscount && LONG_CONTEXT_NODES.has(node.id) && delta.C < 0) {
    delta.C += 2;
    state.pending.deepseekCostDiscount = false;
    state.logs.push('DeepSeek 稀疏预算生效：本节点算力消耗 -2。');
  }

  applyDelta(delta, 1);
  let skillMsg = useSkill(selectedSkillId, option);
  if (skillMsg === '__replayed__') return;
  if (skillMsg) state.logs.push(skillMsg);

  if (state.pending.geminiNoiseShield && state.N > preNoise) {
    state.N -= 1;
    state.pending.geminiNoiseShield = false;
    state.logs.push('Gemini 上下文预警生效：已抵消本轮噪声 +1。');
  }

  state.selectedTags.push(option.tag);
  state.logs.push(`节点${node.id} 选择 ${option.key}：${option.text}`);

  state.nodeIndex += 1;
  let failure = getFailureReason();
  failure = tryArbitrateFailure(failure);
  if (failure) {
    state.ended = true;
    state.endTitle = 'Bad End《回归到 Vibe Coding》';
    state.endDesc = `失败原因：${failure}`;
  } else if (state.nodeIndex >= NODES.length) {
    finishGame();
  }
  render();
}

function resetGame() {
  state = structuredClone(INITIAL_STATE);
  selectedSkillId = null;
  render();
}

function renderStatus() {
  statusPanel.innerHTML = `
    <div class="metric"><span>研发分</span><strong>${state.R}</strong></div>
    <div class="metric"><span>工程分</span><strong>${state.E}</strong></div>
    <div class="metric"><span>长程分</span><strong>${state.L}</strong></div>
    <div class="metric"><span>算力预算</span><strong>${state.C}</strong></div>
    <div class="metric"><span>噪声</span><strong>${state.N}</strong></div>
  `;
}

function renderSkills() {
  skillsPanel.innerHTML = SKILLS.map((skill) => {
    const used = !!state.usedSkills[skill.id];
    const active = selectedSkillId === skill.id;
    return `
      <button class="skill ${active ? 'active' : ''} ${used ? 'used' : ''}" data-skill-id="${skill.id}" ${used ? 'disabled' : ''}>
        <span class="skill-name">${skill.name}</span>
        <span class="skill-desc">${skill.desc}</span>
      </button>
    `;
  }).join('');
}

function renderNode() {
  const totalNodes = NODES.length;
  const step = Math.min(state.nodeIndex + 1, totalNodes);
  progress.textContent = state.ended ? '已结局' : `进度：节点 ${step} / ${totalNodes}`;

  if (state.ended) {
    nodePanel.innerHTML = `
      <h2>${escapeHtml(state.endTitle)}</h2>
      <p>${escapeHtml(state.endDesc)}</p>
      <button class="restart-btn" id="restartBtn">再开一局</button>
    `;
    const btn = document.getElementById('restartBtn');
    btn?.addEventListener('click', resetGame);
    return;
  }

  const node = NODES[state.nodeIndex];
  nodePanel.innerHTML = `
    <h2>节点 ${node.id}：${escapeHtml(node.title)}</h2>
    <p class="section">章节依据：${escapeHtml(node.section)}</p>
    <p>${escapeHtml(node.scene)}</p>
    <div class="fact-card"><strong>报告事实卡：</strong>${escapeHtml(node.fact)}</div>
    <div class="options">
      ${node.options.map((opt) => `<button class="option-btn" data-opt-key="${opt.key}">${opt.key}. ${escapeHtml(opt.text)}</button>`).join('')}
    </div>
  `;
  node.options.forEach((opt) => {
    const btn = nodePanel.querySelector(`[data-opt-key="${opt.key}"]`);
    btn?.addEventListener('click', () => applyChoice(opt));
  });
}

function renderLogs() {
  const lines = state.logs.slice(-10).reverse();
  logList.innerHTML = lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
}

function bindSkillEvents() {
  skillsPanel.querySelectorAll('[data-skill-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const skillId = btn.getAttribute('data-skill-id');
      if (skillId) selectSkill(skillId);
    });
  });
}

function render() {
  renderStatus();
  renderSkills();
  renderNode();
  renderLogs();
  bindSkillEvents();
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

render();
