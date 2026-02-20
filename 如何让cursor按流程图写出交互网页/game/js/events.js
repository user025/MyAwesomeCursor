/**
 * 事件绑定：背包、箭头、键盘、步骤选项委托。
 * 调用 context 与 render，不包含业务分支细节。
 */
import * as render from './render.js';

/**
 * 绑定所有 UI 事件
 * @param {Object} context - createContext 返回值
 * @param {Object} renderApi - render 模块
 * @param {Object} dom - { stepContainer, progressBar, arrowPrev, arrowNext, backpack, backpackBody }
 * @param {function} refresh - 状态变更后刷新全部视图：refresh()
 */
export function bind(context, renderApi, dom, refresh) {
  const { stepContainer, progressBar, arrowPrev, arrowNext, backpack, backpackBody } = dom;

  if (stepContainer) {
    stepContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-option');
      if (!btn) return;
      const next = btn.getAttribute('data-next');
      const item = btn.getAttribute('data-item');
      if (!next) return;
      context.navigate(next, { choiceItemId: item || undefined });
      refresh();
    });
  }

  if (arrowPrev) {
    arrowPrev.addEventListener('click', () => {
      const state = context.getState();
      const prevId = context.prevStepMap[state.currentStepId];
      if (prevId) {
        context.goBack(prevId);
        refresh();
      }
    });
  }
  if (arrowNext) {
    arrowNext.addEventListener('click', () => {
      const state = context.getState();
      const step = context.getStep(state.currentStepId);
      if (step && step.choices && step.choices.length === 1 && step.choices[0].next !== '__restart') {
        const choice = step.choices[0];
        context.navigate(choice.next, { choiceItemId: choice.item || undefined });
        refresh();
      }
      refresh();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      const state = context.getState();
      const prevId = context.prevStepMap[state.currentStepId];
      if (prevId) {
        context.goBack(prevId);
        refresh();
      }
    } else if (e.key === 'ArrowRight') {
      const state = context.getState();
      const step = context.getStep(state.currentStepId);
      if (step && !step.isEnd && step.choices && step.choices.length === 1 && step.choices[0].next !== '__restart') {
        const choice = step.choices[0];
        context.navigate(choice.next, { choiceItemId: choice.item || undefined });
        refresh();
      } else {
        refresh();
      }
    }
  });

  if (backpack) {
    const toggle = backpack.querySelector('#backpack-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => backpack.classList.toggle('active'));
    }
    document.addEventListener('click', (e) => {
      if (!backpack.contains(e.target)) backpack.classList.remove('active');
    });
  }

  refresh();
}
