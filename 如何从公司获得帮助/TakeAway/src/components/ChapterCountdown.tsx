import type { PlayerTimeState } from '../engine';

interface ChapterCountdownProps {
  time: PlayerTimeState;
}

export function ChapterCountdown({ time }: ChapterCountdownProps) {
  const ratio = Math.max(0, Math.min(1, time.remaining / time.total));
  const handRadians = (ratio * 360 - 90) * (Math.PI / 180);
  const handX = 50 + Math.cos(handRadians) * 28;
  const handY = 50 + Math.sin(handRadians) * 28;
  const ringRadius = 42;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - ratio);
  const isUrgent = ratio <= 0.2;

  return (
    <div className={`chapter-countdown ${isUrgent ? 'chapter-countdown--urgent' : ''}`}>
      <svg
        className="chapter-countdown-clock"
        viewBox="0 0 100 100"
        role="img"
        aria-label={`${time.chapterName} 剩余 ${time.remaining}${time.unit}`}
      >
        <circle className="chapter-countdown-face" cx="50" cy="50" r="46" />
        <circle
          className="chapter-countdown-ring"
          cx="50"
          cy="50"
          r={ringRadius}
          strokeDasharray={ringCircumference}
          strokeDashoffset={ringOffset}
        />
        {[0, 90, 180, 270].map(angle => {
          const rad = (angle - 90) * (Math.PI / 180);
          const x1 = 50 + Math.cos(rad) * 36;
          const y1 = 50 + Math.sin(rad) * 36;
          const x2 = 50 + Math.cos(rad) * 40;
          const y2 = 50 + Math.sin(rad) * 40;
          return (
            <line
              key={angle}
              className="chapter-countdown-tick"
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
            />
          );
        })}
        <line className="chapter-countdown-hand" x1="50" y1="50" x2={handX} y2={handY} />
        <circle className="chapter-countdown-hub" cx="50" cy="50" r="3" />
      </svg>
      <div className="chapter-countdown-meta">
        <span className="chapter-countdown-chapter">{time.chapterName}</span>
        <span className="chapter-countdown-value">
          剩余 {time.remaining}/{time.total}{time.unit}
        </span>
      </div>
    </div>
  );
}
