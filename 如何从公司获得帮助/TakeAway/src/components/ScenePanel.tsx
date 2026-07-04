import type { Scene } from '../engine';

interface ScenePanelProps {
  scene: Scene;
  narrative: string | null;
}

export function ScenePanel({ scene, narrative }: ScenePanelProps) {
  return (
    <div className="scene-panel">
      <div className="scene-header">
        <span className="location-tag">{scene.location}</span>
        <h2 className="scene-title">{scene.title}</h2>
      </div>
      <div className="scene-divider">{'─'.repeat(40)}</div>
      <div className="scene-description">
        {narrative ? (
          <>
            <p className="narrative-text">"{narrative}"</p>
            <div className="scene-divider small">{'·'.repeat(20)}</div>
          </>
        ) : null}
        <p>{scene.description}</p>
      </div>
    </div>
  );
}
