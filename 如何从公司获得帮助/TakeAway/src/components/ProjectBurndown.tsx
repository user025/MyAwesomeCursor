import type { ActiveProjectView } from '../engine';

interface ProjectBurndownProps {
  project: ActiveProjectView;
}

export function ProjectBurndown({ project }: ProjectBurndownProps) {
  const segmentCount = Math.max(1, project.requiredHours);
  const spentSegments = Math.min(segmentCount, Math.floor(project.spentHours));

  return (
    <div className="project-burndown">
      <div className="project-burndown-header">
        <span className="project-burndown-label">项目燃尽</span>
        <span className="project-burndown-name">{project.name}</span>
      </div>
      <div
        className="project-burndown-chart"
        role="img"
        aria-label={`${project.name} 剩余 ${project.remainingHours}${project.unit}`}
      >
        {Array.from({ length: segmentCount }, (_, index) => (
          <div
            key={index}
            className={`project-burndown-segment${
              index < spentSegments ? ' project-burndown-segment--spent' : ''
            }`}
          />
        ))}
      </div>
      <span className="project-burndown-value">
        剩余 {project.remainingHours}/{project.requiredHours}{project.unit}
      </span>
    </div>
  );
}
