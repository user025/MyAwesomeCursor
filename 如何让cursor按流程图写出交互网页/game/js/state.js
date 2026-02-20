/**
 * 游戏状态：纯逻辑，不依赖 DOM。
 * 提供 createInitialState、addItem、reset、getPrevStepId、getProgressPercent、isEndStep。
 */
import { INITIAL_STEP_ID, RESTART_ID, MAX_STEP_COUNT, PREV_STEP_MAP } from './config/steps.js';

/**
 * 创建初始状态
 * @param {number} [maxStepCount=MAX_STEP_COUNT]
 * @returns {{ currentStepId: string, inventory: string[], stepCount: number, maxStepCount: number }}
 */
export function createInitialState(maxStepCount = MAX_STEP_COUNT) {
  return {
    currentStepId: INITIAL_STEP_ID,
    inventory: [],
    stepCount: 0,
    maxStepCount
  };
}

/**
 * 向背包添加道具（去重），返回新 inventory，不修改原数组
 * @param {string[]} inventory
 * @param {string} itemId
 * @returns {{ newInventory: string[], added: boolean }}
 */
export function addItem(inventory, itemId) {
  if (!itemId || inventory.includes(itemId)) {
    return { newInventory: inventory, added: false };
  }
  return { newInventory: [...inventory, itemId], added: true };
}

/**
 * 重置为初始状态
 * @param {number} [maxStepCount=MAX_STEP_COUNT]
 * @returns {{ currentStepId: string, inventory: string[], stepCount: number, maxStepCount: number }}
 */
export function reset(maxStepCount = MAX_STEP_COUNT) {
  return createInitialState(maxStepCount);
}

/**
 * 获取上一步 stepId
 * @param {string} stepId
 * @param {Record<string, string>} [prevMap=PREV_STEP_MAP]
 * @returns {string | undefined}
 */
export function getPrevStepId(stepId, prevMap = PREV_STEP_MAP) {
  return prevMap[stepId];
}

/**
 * 进度百分比 0–100
 * @param {{ stepCount: number, maxStepCount: number }} state
 * @returns {number}
 */
export function getProgressPercent(state) {
  const { stepCount, maxStepCount } = state;
  if (!maxStepCount) return 0;
  return Math.min(100, (stepCount / maxStepCount) * 100);
}

/**
 * 是否为结局步骤
 * @param {{ isEnd?: boolean }} step
 * @returns {boolean}
 */
export function isEndStep(step) {
  return Boolean(step && step.isEnd);
}

export { RESTART_ID, INITIAL_STEP_ID, MAX_STEP_COUNT };
