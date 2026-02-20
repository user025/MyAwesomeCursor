/**
 * 入口：组合 config、context、render、events，挂载并启动。
 */
import { ITEMS } from './config/items.js';
import { STEPS, PREV_STEP_MAP, MAX_STEP_COUNT } from './config/steps.js';
import { createContext } from './context.js';
import { getProgressPercent } from './state.js';
import * as render from './render.js';
import { bind } from './events.js';

const config = {
  items: ITEMS,
  steps: STEPS,
  prevStepMap: PREV_STEP_MAP,
  maxStepCount: MAX_STEP_COUNT
};

function showToast(message, icon) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast-msg';
  el.setAttribute('role', 'alert');
  el.innerHTML = (icon ? '<span class="toast-icon">' + escapeHtml(icon) + '</span>' : '') + '<span>' + escapeHtml(message) + '</span>';
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 2500);
}

function escapeHtml(s) {
  if (s == null) return '';
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

const context = createContext(config, { onToast: showToast });

const dom = {
  stepContainer: document.getElementById('stepContainer'),
  progressBar: document.getElementById('progressBar'),
  arrowPrev: document.getElementById('arrow-prev'),
  arrowNext: document.getElementById('arrow-next'),
  backpack: document.getElementById('backpack'),
  backpackBody: document.getElementById('backpackBody')
};

function refresh() {
  const state = context.getState();
  const step = context.getStep(state.currentStepId);
  const items = context.items;
  if (step && dom.stepContainer) render.renderStep(dom.stepContainer, step, items);
  if (dom.backpackBody) render.renderBackpack(dom.backpackBody, state.inventory, items);
  if (dom.progressBar) render.updateProgressBar(dom.progressBar, getProgressPercent(state));
  if (dom.arrowPrev && dom.arrowNext) render.updateArrows(dom.arrowPrev, dom.arrowNext, state, step, context.prevStepMap);
}

bind(context, render, dom, refresh);
