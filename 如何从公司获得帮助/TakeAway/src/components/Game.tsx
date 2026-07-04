import { useState, useCallback, useRef, useEffect } from 'react';
import type { Choice, GameEngine, GamePhase, LevelUpStat, Player } from '../engine';
import { ScenePanel } from './ScenePanel';
import { ChoicePanel } from './ChoicePanel';
import { PlayerStats } from './PlayerStats';
import { Inventory } from './Inventory';
import { RelationshipPanel } from './RelationshipPanel';
import { StartScreen } from './StartScreen';
import { GameHud } from './GameHud';

interface GameProps {
  engine: GameEngine;
}

interface Toast {
  message: string;
}

export function Game({ engine }: GameProps) {
  const { story, items, meta } = engine;
  const startScene = story.getStartSceneId();

  const [phase, setPhase] = useState<GamePhase>('title');
  const [player, setPlayer] = useState<Player>(engine.createPlayer(''));
  const [currentScene, setCurrentScene] = useState(startScene);
  const [narrative, setNarrative] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const [levelUpChoice, setLevelUpChoice] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sceneRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentScene, narrative]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleStart = useCallback((name: string) => {
    setPlayer(engine.createPlayer(name));
    setPhase('playing');
    setCurrentScene(startScene);
    setNarrative(null);
    setLog(meta?.introLog ? [meta.introLog] : []);
    setToast(null);
  }, [engine, startScene, meta?.introLog]);

  const useItem = useCallback((itemId: string, functionId?: string) => {
    setPlayer(prev => {
      const result = items.useItem(prev, itemId, functionId);
      if (!result) return prev;
      setLog(l => [...result.logEntries, ...l]);
      showToast(result.toastEntries);
      if (result.healthEnding) {
        const transition = story.navigateToScene(result.healthEnding.sceneId, result.player);
        setCurrentScene(transition.sceneId);
        setNarrative(result.healthEnding.narrative);
        setLog(l => [...transition.logEntries, ...l]);
        return transition.player;
      }
      if (result.timeoutTransition) {
        const transition = story.navigateToScene(result.timeoutTransition.sceneId, result.player);
        setCurrentScene(transition.sceneId);
        setNarrative(result.timeoutTransition.narrative);
        setLog(l => [...transition.logEntries, ...l]);
        return transition.player;
      }
      return result.player;
    });
  }, [items, story]);

  const handleChoice = useCallback((choice: Choice) => {
    setPlayer(prev => {
      const result = story.resolveChoice(choice, prev, currentScene);
      setLog(l => [...result.logEntries, ...l]);
      showToast(result.toastEntries);
      setNarrative(result.narrative);
      setCurrentScene(result.nextSceneId);
      if (result.leveledUp) setLevelUpChoice(true);
      return result.player;
    });
  }, [story, currentScene]);

  const handleLevelUp = useCallback((stat: LevelUpStat) => {
    setPlayer(prev => engine.applyLevelUp(prev, stat));
    setLevelUpChoice(false);
    const label = meta?.statLabels?.[stat] ?? stat;
    setLog(l => [`升级！+15 HP，+5 ${label}`, ...l]);
  }, [engine, meta?.statLabels]);

  const restart = useCallback(() => {
    setPhase('title');
    setPlayer(engine.createPlayer(''));
    setCurrentScene(startScene);
    setNarrative(null);
    setLog([]);
    setToast(null);
    setLevelUpChoice(false);
  }, [engine, startScene]);

  const retryChapter = useCallback(() => {
    const restored = story.restoreChapterCheckpoint(player);
    if (!restored) {
      restart();
      return;
    }

    setPlayer(restored.player);
    setCurrentScene(restored.sceneId);
    setNarrative(null);
    setLog(l => [`已回到当前章节：${restored.player.time?.chapterName ?? '当前章节'}`, ...l]);
    setToast(null);
    setLevelUpChoice(false);
  }, [player, restart, story]);

  const scene = story.getScene(currentScene);
  if (!scene) {
    return <div className="game-error">场景未找到：{currentScene}</div>;
  }

  const isEnding = story.isEnding(currentScene);
  const isBadEnding = currentScene.startsWith('ending_bad');
  const endingInfo = story.getEndingInfo(currentScene, player.flags, meta?.endings);
  const sceneChoices = story.getSceneChoices(currentScene, player);
  const showCountdown = Boolean(player.time?.enabled);
  const activeProject = story.getActiveProject(currentScene, player);
  const healthConfig = story.getHealthConfig();

  if (phase === 'title') {
    return (
      <StartScreen
        title={meta?.title}
        subtitle={meta?.subtitle}
        onStart={handleStart}
      />
    );
  }

  return (
    <div className="game-container">
      <GameHud
        showCountdown={showCountdown}
        time={player.time}
        project={activeProject}
        hp={player.hp}
        healthConfig={healthConfig}
      />
      {toast && <div className="game-toast-float">{toast.message}</div>}
      <div className="game-layout">
        <div className="game-main" ref={sceneRef}>
          <ScenePanel scene={scene} narrative={narrative} />

          {isEnding && endingInfo && (
            <div className={`ending-banner ${endingInfo.className}`}>
              {endingInfo.label}
            </div>
          )}

          <ChoicePanel
            choices={sceneChoices}
            getTimeCost={choice => story.getChoiceTimeCost(choice, player)}
            isChoiceAvailable={choice => story.isChoiceAvailable(choice, player)}
            timeUnit={player.time?.unit}
            onChoose={handleChoice}
          />

          {isEnding && (
            <button className="btn btn-primary restart-btn" onClick={isBadEnding ? retryChapter : restart}>
              {isBadEnding ? '↻ 回到当前章节' : '↻ 再来一次'}
            </button>
          )}
        </div>

        <div className="game-sidebar">
          <PlayerStats
            player={player}
            healthAlertThreshold={healthConfig?.alertThreshold}
          />
          <Inventory player={player} items={items} onUseItem={useItem} />
          <RelationshipPanel player={player} characters={meta?.characters} />

          <div className="log-panel">
            <h3 className="panel-title">日志</h3>
            <div className="log-entries">
              {log.slice(0, 8).map((entry, i) => (
                <p key={i} className="log-entry">{entry}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {levelUpChoice && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>升级！Lv.{player.level}</h2>
            <p>选择一个属性来提升：</p>
            <div className="modal-choices">
              <button className="btn btn-modal" onClick={() => handleLevelUp('charisma')}>
                🗣️ 羽翼 +5
              </button>
              <button className="btn btn-modal" onClick={() => handleLevelUp('productivity')}>
                📊 砖功 +5
              </button>
              <button className="btn btn-modal" onClick={() => handleLevelUp('upwardManagement')}>
                🤝 向上管理 +5
              </button>
              <button className="btn btn-modal" onClick={() => handleLevelUp('hp')}>
                ❤️ 最大健康 +15
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  function showToast(entries: string[]) {
    if (entries.length === 0) return;
    setToast({
      message: entries.join(' ｜ '),
    });
  }
}
