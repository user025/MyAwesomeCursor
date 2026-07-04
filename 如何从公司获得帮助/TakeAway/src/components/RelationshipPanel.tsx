import { useState } from 'react';
import type { CharacterDef, CharacterRelationshipState, Player } from '../engine';

interface RelationshipPanelProps {
  player: Player;
  characters?: Record<string, CharacterDef>;
}

export function RelationshipPanel({ player, characters = {} }: RelationshipPanelProps) {
  const [collapsed, setCollapsed] = useState(true);
  const characterIds = getCharacterIds(characters, player.relationships);
  if (characterIds.length === 0) return null;

  return (
    <div className="relationship-panel">
      <button
        className="relationship-toggle"
        type="button"
        onClick={() => setCollapsed(value => !value)}
        aria-expanded={!collapsed}
      >
        <span className="panel-title">人物关系</span>
        <span className="relationship-toggle-meta">
          {characterIds.length} 人 {collapsed ? '▸' : '▾'}
        </span>
      </button>
      {!collapsed && (
        <div className="relationship-list">
          {characterIds.map(characterId => {
            const character = characters[characterId];
            const relationship = player.relationships[characterId];
            return (
              <RelationshipCard
                key={characterId}
                characterId={characterId}
                character={character}
                relationship={relationship}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function RelationshipCard({
  characterId,
  character,
  relationship,
}: {
  characterId: string;
  character?: CharacterDef;
  relationship?: CharacterRelationshipState;
}) {
  const affinity = relationship?.affinity ?? 0;
  const interactions = relationship?.interactions ?? [];
  const recentInteractions = interactions.slice(-3).reverse();

  return (
    <div className="relationship-card">
      <div className="relationship-header">
        <span className="relationship-emoji">{character?.emoji ?? '👤'}</span>
        <div className="relationship-identity">
          <span className="relationship-name">{character?.name ?? characterId}</span>
          {character?.role && <span className="relationship-role">{character.role}</span>}
        </div>
        <span className={`relationship-affinity ${getAffinityClass(affinity)}`}>
          {affinity > 0 ? '+' : ''}{affinity}
        </span>
      </div>

      {character?.description && (
        <p className="relationship-description">{character.description}</p>
      )}

      {recentInteractions.length > 0 ? (
        <div className="relationship-history">
          {recentInteractions.map((interaction, index) => (
            <p key={`${interaction.choiceId ?? 'interaction'}-${index}`} className="relationship-entry">
              {interaction.summary}
              {interaction.affinityDelta ? (
                <span className="relationship-entry-delta">
                  {interaction.affinityDelta > 0 ? '+' : ''}{interaction.affinityDelta}
                </span>
              ) : null}
            </p>
          ))}
        </div>
      ) : (
        <p className="relationship-empty">尚未互动。</p>
      )}
    </div>
  );
}

function getCharacterIds(
  characters: Record<string, CharacterDef>,
  relationships: Record<string, CharacterRelationshipState>,
): string[] {
  return Array.from(new Set([...Object.keys(characters), ...Object.keys(relationships)]));
}

function getAffinityClass(affinity: number): string {
  if (affinity > 0) return 'positive';
  if (affinity < 0) return 'negative';
  return 'neutral';
}
