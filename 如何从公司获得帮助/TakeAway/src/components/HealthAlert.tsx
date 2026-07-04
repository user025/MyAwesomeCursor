interface HealthAlertProps {
  hp: number;
  message: string;
}

export function HealthAlert({ hp, message }: HealthAlertProps) {
  return (
    <div className="health-alert" role="alert" aria-live="assertive">
      <span className="health-alert-icon">⚠️</span>
      <div className="health-alert-copy">
        <span className="health-alert-text">{message}</span>
        <span className="health-alert-value">当前健康 {hp}</span>
      </div>
    </div>
  );
}
