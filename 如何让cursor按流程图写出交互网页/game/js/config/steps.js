/**
 * 步骤表与导航映射：STEPS、PREV_STEP_MAP、常量
 * 配置与代码分离，新增/修改步骤只改本文件。
 */
export const INITIAL_STEP_ID = 'start';
export const RESTART_ID = '__restart';
export const MAX_STEP_COUNT = 22;

/** 上一步映射（用于箭头与键盘） */
export const PREV_STEP_MAP = {
  check: 'start',
  prep: 'check',
  submit: 'prep',
  review: 'submit',
  materialCheck: 'review',
  notice: 'materialCheck',
  accept: 'materialCheck',
  fail3: 'accept',
  appealResult: 'fail3',
  process: 'accept',
  c1: 'process', c2: 'process', c3: 'process', c4: 'process', mediate: 'process',
  mediateResult: 'mediate'
};

/** 步骤表：id, title, body, icon, choices, item?, isEnd?, endType? */
export const STEPS = [
  { id: 'start', title: '你的权利受到侵害', body: '你发现自己的知识产权（专利、商标、著作权等）可能被他人侵害，决定寻求维权援助。', icon: '📋', choices: [{ text: '开始申请', next: 'check' }] },
  { id: 'check', title: '是否符合申请条件？', body: '维权援助机构要求：申请人户籍地、经常居住地、营业地或侵权行为发生地，至少有一项在该机构辖区内。', icon: '❓', choices: [
    { text: '否，都不在辖区', next: 'fail1', item: 'area_fail' },
    { text: '是，符合条件', next: 'prep' }
  ]},
  { id: 'prep', title: '准备申请材料', body: '请准备《知识产权维权援助申请表》、有效身份证明、事项与事由及证明材料等。', icon: '📄', choices: [{ text: '已准备好，继续', next: 'submit', item: 'material_list' }], item: 'form_sample' },
  { id: 'submit', title: '提交维权援助申请', body: '通过中国知识产权维权援助网（ipwq.cn/online_pc）在线提交申请。', icon: '📤', choices: [{ text: '已提交', next: 'review', item: 'submit_proof' }], item: 'ipwq_guide' },
  { id: 'review', title: '机构审查', body: '机构将在 15 个工作日内对申请进行审查。', icon: '🔍', choices: [{ text: '等待结果', next: 'materialCheck' }], item: 'review_note' },
  { id: 'materialCheck', title: '材料是否完整、充分？', body: '机构审查后判断材料是否完整、充分。', icon: '📋', choices: [
    { text: '否，收到补正通知', next: 'notice', item: 'supplement_notice' },
    { text: '是，材料通过', next: 'accept' }
  ]},
  { id: 'notice', title: '补正通知书', body: '机构已发出《补正通知书》，请在 7 个工作日内按要求补充或说明，否则视为主动撤回申请。', icon: '📩', choices: [
    { text: '未在 7 日内补正', next: 'fail2', item: 'withdraw_note' },
    { text: '已在 7 日内补正', next: 'review', item: 'supplement_done' }
  ]},
  { id: 'accept', title: '是否受理？', body: '机构根据审查结果决定是否受理你的申请。', icon: '📬', choices: [
    { text: '不予受理', next: 'fail3', item: 'reject_letter' },
    { text: '受理', next: 'process', item: 'accept_letter' }
  ]},
  { id: 'fail3', title: '不予受理', body: '机构决定不予受理并已说明理由。你可在收到通知后 7 个工作日内向所属知识产权管理部门提起申诉。', icon: '❌', choices: [
    { text: '不申诉，程序终结', next: 'endFail1' },
    { text: '提起申诉', next: 'appealResult', item: 'appeal_copy' }
  ]},
  { id: 'appealResult', title: '申诉结果', body: '知识产权管理部门对申诉进行审查。', icon: '📢', choices: [
    { text: '维持不予受理', next: 'fail4', item: 'appeal_upheld' },
    { text: '撤销并受理', next: 'process', item: 'appeal_undo' }
  ]},
  { id: 'process', title: '进入维权援助处理', body: '请选择你需要的援助类型。', icon: '⚙️', choices: [
    { text: '咨询', next: 'c1' },
    { text: '侵权判定', next: 'c2' },
    { text: '重大公共纠纷', next: 'c3' },
    { text: '分析预警/培训/驻场等', next: 'c4' },
    { text: '调解', next: 'mediate' }
  ]},
  { id: 'c1', title: '提供咨询指导意见', body: '机构已根据你的需求提供咨询指导意见。', icon: '💬', choices: [{ text: '查看结局', next: 'endOK' }], item: 'consult_opinion' },
  { id: 'c2', title: '侵权判定参考意见', body: '机构已按流程提供侵权判定参考意见。', icon: '⚖️', choices: [{ text: '查看结局', next: 'endOK' }], item: 'infringement_opinion' },
  { id: 'c3', title: '解决方案或建议', body: '机构已就重大公共纠纷提供解决方案或建议。', icon: '📋', choices: [{ text: '查看结局', next: 'endOK' }], item: 'solution_doc' },
  { id: 'c4', title: '相应服务', body: '机构已协调资源，提供分析预警、培训或驻场等相应服务。', icon: '📄', choices: [{ text: '查看结局', next: 'endOK' }], item: 'service_confirm' },
  { id: 'mediate', title: '双方是否同意调解？', body: '调解需要双方同意才能开展。', icon: '🤝', choices: [
    { text: '对方不同意调解', next: 'fail5', item: 'no_mediate_note' },
    { text: '双方同意调解', next: 'mediateResult', item: 'mediate_agree' }
  ]},
  { id: 'mediateResult', title: '调解是否达成？', body: '调解工作已开展，结果如何？', icon: '🤝', choices: [
    { text: '未达成一致', next: 'fail6', item: 'mediate_fail_note' },
    { text: '达成一致', next: 'endOK', item: 'mediate_protocol' }
  ]},
  { id: 'fail1', title: '无法申请', body: '你的户籍地、经常居住地、营业地及侵权行为发生地均不在该维权援助机构辖区内，无法向该机构申请。请确认辖区条件或联系其他辖区机构。', icon: '💔', choices: [{ text: '再玩一次', next: '__restart' }], isEnd: true, endType: 'fail' },
  { id: 'fail2', title: '视为主动撤回', body: '收到《补正通知书》后，7 个工作日内未按要求补充或说明，视为主动撤回申请。维权援助程序终结。', icon: '💔', choices: [{ text: '再玩一次', next: '__restart' }], isEnd: true, endType: 'fail' },
  { id: 'fail4', title: '申诉维持', body: '知识产权管理部门维持不予受理决定，维权援助程序终结。', icon: '💔', choices: [{ text: '再玩一次', next: '__restart' }], isEnd: true, endType: 'fail' },
  { id: 'fail5', title: '无法开展调解', body: '对方不同意调解，无法开展调解工作。你可另行寻求行政、司法或仲裁等途径维权。', icon: '💔', choices: [{ text: '再玩一次', next: '__restart' }], isEnd: true, endType: 'fail' },
  { id: 'fail6', title: '调解未达成', body: '双方同意调解但最终未达成一致，维权援助中的调解程序结束。你可另行通过诉讼、仲裁等途径维权。', icon: '💔', choices: [{ text: '再玩一次', next: '__restart' }], isEnd: true, endType: 'fail' },
  { id: 'endFail1', title: '程序终结', body: '未在 7 个工作日内提起申诉，维权援助程序终结。', icon: '💔', choices: [{ text: '再玩一次', next: '__restart' }], isEnd: true, endType: 'fail' },
  { id: 'endOK', title: '获得援助服务', body: '你已成功获得知识产权维权援助服务。祝维权顺利！', icon: '🎉', choices: [{ text: '再玩一次', next: '__restart' }], isEnd: true, endType: 'ok' }
];
