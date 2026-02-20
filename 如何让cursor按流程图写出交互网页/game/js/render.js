/**
 * 纯渲染：根据 step、inventory、state 生成 HTML 或更新 DOM。
 * 不处理事件与状态写入。内部复用 renderItemCard、renderChoiceButtons。
 */
import { RESTART_ID } from './config/steps.js';
import { isEndStep } from './state.js';

/**
 * 单张道具卡片 HTML
 * @param {{ icon: string, name: string, desc?: string }} item
 * @returns {string}
 */
export function renderItemCard(item) {
  const desc = item.desc || '';
  return '<div class="item-card"><div class="item-icon">' + escapeHtml(item.icon) + '</div><div class="item-name">' + escapeHtml(item.name) + '</div><div class="item-desc">' + escapeHtml(desc) + '</div></div>';
}

/**
 * 选项按钮组 HTML（含 data-next、data-item 供委托）
 * @param {Array<{ text: string, next: string, item?: string }>} choices
 * @param {Object} items - 道具表，用于无需传参
 * @returns {string}
 */
export function renderChoiceButtons(choices, items) {
  return choices.map(c => {
    const cls = c.next === RESTART_ID ? 'btn-option btn-restart' : 'btn-option';
    return '<button type="button" class="' + cls + '" data-next="' + escapeHtml(c.next) + '" data-item="' + escapeHtml(c.item || '') + '">' + escapeHtml(c.text) + '</button>';
  }).join('');
}

/**
 * 当前步骤视图 HTML
 * @param {Object} step
 * @param {Object} items - 仅用于结构一致，选项由 step.choices 自带 item id
 * @returns {string}
 */
export function renderStepContent(step, items) {
  const endClass = step.endType === 'fail' ? ' end-fail' : step.endType === 'ok' ? ' end-ok' : '';
  const choicesHtml = renderChoiceButtons(step.choices, items);
  return '<div class="step active' + endClass + '" data-step="' + escapeHtml(step.id) + '" aria-label="' + escapeHtml(step.title) + '">' +
    '<div class="step-content">' +
    '<div class="step-icon">' + escapeHtml(step.icon) + '</div>' +
    '<h2>' + escapeHtml(step.title) + '</h2>' +
    '<div class="step-body">' + step.body + '</div>' +
    '<div class="choices">' + choicesHtml + '</div>' +
    '</div></div>';
}

/**
 * 将步骤视图挂载到容器
 * @param {HTMLElement} container
 * @param {Object} step
 * @param {Object} items
 */
export function renderStep(container, step, items) {
  if (!container || !step) return;
  container.innerHTML = renderStepContent(step, items);
}

/**
 * 背包内容 HTML
 * @param {string[]} inventory
 * @param {Object} items
 * @returns {string}
 */
export function renderBackpackContent(inventory, items) {
  if (!inventory || inventory.length === 0) {
    return '<div class="backpack-empty">暂无道具，在流程中做出选择即可收集～</div>';
  }
  return inventory.map(id => {
    const it = items[id];
    return it ? renderItemCard(it) : '';
  }).filter(Boolean).join('');
}

/**
 * 将背包视图挂载到容器
 * @param {HTMLElement} container
 * @param {string[]} inventory
 * @param {Object} items
 */
export function renderBackpack(container, inventory, items) {
  if (!container) return;
  container.innerHTML = renderBackpackContent(inventory, items);
}

/**
 * 更新进度条
 * @param {HTMLElement} barEl
 * @param {number} percent 0–100
 */
export function updateProgressBar(barEl, percent) {
  if (!barEl) return;
  barEl.style.width = percent + '%';
  barEl.setAttribute('aria-valuenow', Math.round(percent));
}

/**
 * 更新左右箭头可用状态
 * @param {HTMLElement} prevEl
 * @param {HTMLElement} nextEl
 * @param {Object} state
 * @param {Object} step - 当前步骤
 * @param {Record<string, string>} prevStepMap
 */
export function updateArrows(prevEl, nextEl, state, step, prevStepMap) {
  if (!prevEl || !nextEl) return;
  const hasPrev = Boolean(prevStepMap[state.currentStepId]);
  const isEnd = step && isEndStep(step);
  prevEl.classList.toggle('disabled', !hasPrev);
  nextEl.classList.toggle('disabled', isEnd);
}

function escapeHtml(s) {
  if (s == null) return '';
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}
