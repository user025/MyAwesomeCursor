/**
 * GameContext：持有 config 与 state，对外提供 getStep、getItem、getState、navigate。
 * 不直接操作 DOM，toast 与状态变更通过回调通知。
 */
import { STEPS } from './config/steps.js';
import { RESTART_ID, MAX_STEP_COUNT } from './config/steps.js';
import * as stateModule from './state.js';

const stepMap = {};
STEPS.forEach(s => { stepMap[s.id] = s; });

/**
 * 创建游戏上下文
 * @param {Object} config - { items, steps, prevStepMap, maxStepCount }
 * @param {Object} options - { onToast(message, icon?), onStateChange(state) }
 * @returns {Object} context 门面
 */
export function createContext(config, options = {}) {
  const { items, prevStepMap, maxStepCount = MAX_STEP_COUNT } = config;
  const { onToast, onStateChange } = options;

  let state = stateModule.createInitialState(maxStepCount);

  function getState() {
    return state;
  }

  function getStep(id) {
    return stepMap[id] || null;
  }

  function getItem(id) {
    return items[id] || null;
  }

  function tryGiveItem(itemId) {
    const { newInventory, added } = stateModule.addItem(state.inventory, itemId);
    state = { ...state, inventory: newInventory };
    if (added && itemId) {
      const it = items[itemId];
      if (onToast) {
        onToast('获得了：' + (it ? it.name : itemId), it ? it.icon : '📦');
      }
    }
    return added;
  }

  /**
   * 仅退回上一步（不增加 stepCount、不发放道具）
   * @param {string} prevStepId
   */
  function goBack(prevStepId) {
    if (!prevStepId || !stepMap[prevStepId]) return;
    state = { ...state, currentStepId: prevStepId };
    if (onStateChange) onStateChange(state);
  }

  /**
   * 导航到下一步
   * @param {string} nextId - 步骤 id 或 RESTART_ID
   * @param {{ choiceItemId?: string }} [opts] - 选项携带的道具 id，在跳转前发放并 toast
   */
  function navigate(nextId, opts = {}) {
    const { choiceItemId } = opts;
    if (choiceItemId) {
      tryGiveItem(choiceItemId);
    }
    if (nextId === RESTART_ID) {
      state = stateModule.reset(maxStepCount);
      if (onStateChange) onStateChange(state);
      return;
    }
    const step = stepMap[nextId];
    if (!step) return;
    state = {
      ...state,
      currentStepId: nextId,
      stepCount: Math.min(state.stepCount + 1, maxStepCount)
    };
    if (step.item) {
      tryGiveItem(step.item);
    }
    if (onStateChange) onStateChange(state);
  }

  return {
    getState,
    getStep,
    getItem,
    navigate,
    goBack,
    get prevStepMap() { return prevStepMap; },
    get items() { return items; }
  };
}
