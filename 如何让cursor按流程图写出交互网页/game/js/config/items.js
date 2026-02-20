/**
 * 道具表：id, name, icon, desc
 * 配置与代码分离，仅提供静态数据。
 */
export const ITEMS = {
  area_fail:     { id: 'area_fail',     name: '辖区不符说明',   icon: '📋', desc: '户籍/经常居住地/营业地或侵权行为发生地均不在辖区。' },
  material_list: { id: 'material_list', name: '申请材料清单',   icon: '📄', desc: '申请表、身份证明、事由与证明材料等。' },
  form_sample:   { id: 'form_sample',   name: '维权援助申请表范本', icon: '📝', desc: '知识产权维权援助申请表参考格式。' },
  submit_proof:  { id: 'submit_proof',  name: '提交凭证',       icon: '📤', desc: '已在 ipwq.cn/online_pc 提交申请的凭证。' },
  ipwq_guide:    { id: 'ipwq_guide',    name: '申请指引',       icon: '🔗', desc: '中国知识产权维权援助网申请指引。' },
  review_note:   { id: 'review_note',   name: '15日审查说明',   icon: '🔍', desc: '机构在15个工作日内完成审查。' },
  supplement_notice: { id: 'supplement_notice', name: '补正通知书', icon: '📩', desc: '机构要求补充或说明材料。' },
  supplement_done:  { id: 'supplement_done',   name: '补正材料回执', icon: '✅', desc: '已按要求在7个工作日内补正。' },
  accept_letter: { id: 'accept_letter', name: '受理决定书',     icon: '📬', desc: '维权援助申请已受理。' },
  reject_letter: { id: 'reject_letter', name: '不予受理决定书', icon: '❌', desc: '机构决定不予受理并说明理由。' },
  appeal_copy:   { id: 'appeal_copy',   name: '申诉申请书副本', icon: '📢', desc: '已向知识产权管理部门提起申诉。' },
  appeal_upheld: { id: 'appeal_upheld', name: '申诉维持决定书', icon: '💔', desc: '申诉维持不予受理，程序终结。' },
  appeal_undo:   { id: 'appeal_undo',   name: '撤销决定书',     icon: '🔄', desc: '撤销不予受理，已受理申请。' },
  withdraw_note: { id: 'withdraw_note', name: '视为撤回说明',   icon: '📋', desc: '7个工作日内未补正，视为主动撤回。' },
  consult_opinion: { id: 'consult_opinion', name: '咨询指导意见', icon: '💬', desc: '机构提供的咨询指导意见。' },
  infringement_opinion: { id: 'infringement_opinion', name: '侵权判定参考意见', icon: '⚖️', desc: '按流程提供的侵权判定参考意见。' },
  solution_doc:  { id: 'solution_doc', name: '解决方案或建议书', icon: '📋', desc: '重大公共纠纷的解决方案或建议。' },
  service_confirm: { id: 'service_confirm', name: '服务确认函', icon: '📄', desc: '分析预警/培训/驻场等服务的确认。' },
  mediate_agree: { id: 'mediate_agree', name: '调解同意书',   icon: '🤝', desc: '双方同意调解。' },
  mediate_protocol: { id: 'mediate_protocol', name: '调解协议', icon: '🎉', desc: '调解达成一致。' },
  mediate_fail_note: { id: 'mediate_fail_note', name: '调解未成说明', icon: '📋', desc: '调解未达成，可另行起诉或仲裁。' },
  no_mediate_note: { id: 'no_mediate_note', name: '无法调解说明', icon: '📋', desc: '对方不同意调解，可寻求行政/司法/仲裁等。' }
};
