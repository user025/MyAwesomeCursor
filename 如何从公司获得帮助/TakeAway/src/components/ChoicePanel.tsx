import type { Choice } from '../engine';

const STAT_LABELS: Record<string, string> = {
  charisma: '魅力',
  productivity: '效率',
  caffeine: '咖啡因',
  hp: 'HP',
};

interface ChoicePanelProps {
  choices: Choice[];
  getTimeCost?: (choice: Choice) => number;
  isChoiceAvailable?: (choice: Choice) => boolean;
  timeUnit?: string;
  onChoose: (choice: Choice) => void;
}

export function ChoicePanel({
  choices,
  getTimeCost,
  isChoiceAvailable,
  timeUnit = '分钟',
  onChoose,
}: ChoicePanelProps) {
  if (choices.length === 0) return null;

  return (
    <div className="choice-panel">
      <div className="choice-divider">{'─'.repeat(40)}</div>
      {choices.map(choice => {
        const available = isChoiceAvailable?.(choice) ?? true;
        const statLabel = choice.statCheck
          ? ` [${STAT_LABELS[choice.statCheck.stat] ?? choice.statCheck.stat.toUpperCase()} ≥ ${choice.statCheck.min}]`
          : '';
        const timeCost = getTimeCost?.(choice) ?? choice.timeCost ?? 0;
        const timeLabel = timeCost > 0 ? ` -${timeCost}${timeUnit}` : '';
        const lockedLabel = !available && choice.lockedText ? `（${choice.lockedText}）` : '';
        return (
          <button
            key={choice.id}
            className={`btn btn-choice${available ? '' : ' btn-choice--locked'}`}
            disabled={!available}
            onClick={() => onChoose(choice)}
          >
            <span className="choice-bullet">{available ? '▸' : '◇'}</span>
            <span>{choice.text}{lockedLabel}</span>
            <span className="choice-stat">{statLabel}{timeLabel}</span>
          </button>
        );
      })}
      <div className="choice-divider">{'─'.repeat(40)}</div>
    </div>
  );
}
