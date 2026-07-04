import { useState } from 'react';

interface StartScreenProps {
  title?: string;
  subtitle?: string;
  onStart: (name: string) => void;
}

export function StartScreen({ title = 'MEGACORP', subtitle = '第一天', onStart }: StartScreenProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  return (
    <div className="start-screen">
      <div className="title-block">
        <h1 className="game-title">{title}</h1>
        <p className="subtitle">{subtitle}</p>
        <div className="title-ascii">
          {'┌─┐┬ ┬┌┐ ┌─┐┌─┐┌─┐┌─┐┌─┐'}
          <br />
          {'│  └┬┘├┴┐├┤ ├─┤└─┐├─┘│ │'}
          <br />
          {'└─┘ ┴ └─┘└─┘┴ ┴└─┘┴  └─┘'}
        </div>
      </div>

      <div className="flavor-text">
        玻璃大厦耸立。你的职业生涯在等待。<br />
        员工，你叫什么名字？
      </div>

      <div className="name-input-group">
        <input
          type="text"
          placeholder="请输入你的名字…"
          value={name}
          onChange={e => {
            setName(e.target.value);
            setError(false);
          }}
          onKeyDown={e => e.key === 'Enter' && handleStart()}
          className="name-input"
          maxLength={20}
          autoFocus
        />
        {error && <p className="error-text">你需要一个名字，朋友。</p>}
        <button className="btn btn-primary" onClick={handleStart}>
          开始
        </button>
      </div>
    </div>
  );

  function handleStart() {
    if (!name.trim()) {
      setError(true);
      return;
    }
    onStart(name.trim());
  }
}
