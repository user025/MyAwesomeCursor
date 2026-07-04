import type { ActiveProjectView, HealthConfig, PlayerTimeState } from '../engine';
import { ChapterCountdown } from './ChapterCountdown';
import { HealthAlert } from './HealthAlert';
import { ProjectBurndown } from './ProjectBurndown';

interface GameHudProps {
  showCountdown: boolean;
  time?: PlayerTimeState;
  project: ActiveProjectView | null;
  hp: number;
  healthConfig?: HealthConfig;
}

export function GameHud({ showCountdown, time, project, hp, healthConfig }: GameHudProps) {
  const showHealthAlert = Boolean(healthConfig && hp < healthConfig.alertThreshold);

  if (!showCountdown && !project && !showHealthAlert) {
    return null;
  }

  return (
    <div className="game-hud">
      {showCountdown && time && <ChapterCountdown time={time} />}
      {project && <ProjectBurndown project={project} />}
      {showHealthAlert && healthConfig && (
        <HealthAlert hp={hp} message={healthConfig.alertMessage} />
      )}
    </div>
  );
}
