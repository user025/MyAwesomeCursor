import type { HealthConfig, Player } from './types';

export interface HealthEvaluation {
  alert: boolean;
  critical: boolean;
  endingSceneId?: string;
  narrative?: string;
}

export function evaluateHealth(player: Player, config?: HealthConfig): HealthEvaluation {
  if (!config) {
    return { alert: false, critical: false };
  }

  const alert = player.hp < config.alertThreshold;
  const critical = player.hp < config.criticalThreshold;

  return {
    alert,
    critical,
    endingSceneId: critical ? config.criticalEndingScene : undefined,
    narrative: critical ? config.criticalNarrative : undefined,
  };
}
