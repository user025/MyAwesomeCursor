import type { Player } from '../engine';

interface PlayerStatsProps {
  player: Player;
  healthAlertThreshold?: number;
}

export function PlayerStats({ player, healthAlertThreshold = 60 }: PlayerStatsProps) {
  const isHealthAlert = player.hp < healthAlertThreshold;

  return (
    <div className="stats-panel">
      <h3 className="panel-title">状态</h3>
      <div className={`stat-row${isHealthAlert ? ' stat-row--hp-alert' : ''}`}>
        <span className="stat-label">LV</span>
        <span className="stat-value">{player.level}</span>
        <div className="xp-bar-container">
          <div
            className="xp-bar-fill"
            style={{ width: `${(player.xp / player.xpToNext) * 100}%` }}
          />
        </div>
        <span className="stat-value small">{player.xp}/{player.xpToNext}</span>
      </div>
      <div className="stat-row">
        <span className="stat-label">❤️</span>
        <div className="hp-bar-container">
          <div
            className="hp-bar-fill"
            style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
          />
        </div>
        <span className="stat-value small">{player.hp}/{player.maxHp}</span>
        {isHealthAlert && <span className="hp-alert-badge">警报</span>}
      </div>
      <div className="stat-grid">
        <div className="stat-item" title="羽翼">
          <span className="stat-icon">🗣️</span>
          <span className="stat-num">{player.charisma}</span>
        </div>
        <div className="stat-item" title="咖啡因">
          <span className="stat-icon">☕</span>
          <span className="stat-num">{player.caffeine}</span>
        </div>
        <div className="stat-item" title="砖功">
          <span className="stat-icon">📊</span>
          <span className="stat-num">{player.productivity}</span>
        </div>
        <div className="stat-item" title="向上管理">
          <span className="stat-icon">🤝</span>
          <span className="stat-num">{player.upwardManagement}</span>
        </div>
        <div className="stat-item" title="业余爱好">
          <span className="stat-icon">🎸</span>
          <span className="stat-num">{player.hobby}</span>
        </div>
        <div className="stat-item" title="独立开发">
          <span className="stat-icon">💻</span>
          <span className="stat-num">{player.indieDev}</span>
        </div>
      </div>
    </div>
  );
}
