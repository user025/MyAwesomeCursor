import { useEffect, useState } from 'react';
import type { ItemEngine, ItemFunctionState, Player } from '../engine';

interface InventoryProps {
  player: Player;
  items: ItemEngine;
  onUseItem?: (itemId: string, functionId?: string) => void;
}

export function Inventory({ player, items, onUseItem }: InventoryProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const selectedEntry = player.inventory.find(item => item.itemId === selectedItemId);
  const selectedItem = selectedEntry ? items.getItem(selectedEntry.itemId) : null;
  const selectedFunctions = selectedEntry ? items.getFunctions(player, selectedEntry.itemId) : [];

  useEffect(() => {
    if (selectedItemId && !player.inventory.some(item => item.itemId === selectedItemId)) {
      setSelectedItemId(null);
    }
  }, [player.inventory, selectedItemId]);

  if (player.inventory.length === 0) {
    return (
      <div className="inventory-panel">
        <h3 className="panel-title">背包</h3>
        <p className="empty-text">空的。去找点东西吧。</p>
      </div>
    );
  }

  return (
    <div className="inventory-panel">
      <h3 className="panel-title">背包</h3>
      <div className="inventory-grid">
        {player.inventory.map(item => {
          const def = items.getItem(item.itemId);
          if (!def) return null;
          const quantityMode = items.getQuantityMode(item.itemId);
          return (
            <div
              key={item.itemId}
              className={`inventory-item ${def.type}`}
              title={def.description}
              onClick={() => setSelectedItemId(item.itemId)}
            >
              <span className="item-emoji">{def.emoji}</span>
              <span className="item-name">{def.name}</span>
              {quantityMode === 'countable' && item.quantity > 1 && <span className="item-qty">x{item.quantity}</span>}
              <span className="item-type">{getTypeLabel(def.type)} · {getQuantityModeLabel(quantityMode)}</span>
            </div>
          );
        })}
      </div>

      {selectedEntry && selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItemId(null)}>
          <div className="modal item-modal" onClick={event => event.stopPropagation()}>
            <button
              className="item-modal-close"
              type="button"
              onClick={() => setSelectedItemId(null)}
              aria-label="关闭道具说明"
            >
              ×
            </button>

            <div className="item-modal-header">
              <span className="item-modal-emoji">{selectedItem.emoji}</span>
              <div>
                <h2>{selectedItem.name}</h2>
                <p className="item-modal-type">
                  {getTypeLabel(selectedItem.type)} · {getInventoryQuantityLabel(items.getQuantityMode(selectedEntry.itemId), selectedEntry.quantity)}
                </p>
              </div>
            </div>

            <p className="item-modal-description">{selectedItem.description}</p>

            <div className="item-functions">
              <h3 className="panel-title">功能</h3>
              {selectedFunctions.map(fn => (
                <ItemFunctionRow
                  key={fn.id}
                  itemId={selectedEntry.itemId}
                  fn={fn}
                  onUseItem={onUseItem}
                  onClose={() => setSelectedItemId(null)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ItemFunctionRow({
  itemId,
  fn,
  onUseItem,
  onClose,
}: {
  itemId: string;
  fn: ItemFunctionState;
  onUseItem?: (itemId: string, functionId?: string) => void;
  onClose: () => void;
}) {
  const description = fn.unlocked ? fn.description : fn.lockedDescription ?? '后续剧情解锁。';
  const canAct = fn.unlocked && fn.action === 'use' && onUseItem;
  const timeText = fn.resolvedTimeCost > 0 ? `-${fn.resolvedTimeCost}${fn.resolvedTimeUnit}` : '';

  if (canAct) {
    return (
      <button
        className="item-function action"
        type="button"
        onClick={() => {
          canAct(itemId, fn.id);
          onClose();
        }}
      >
        <span className="item-function-name">
          {fn.name}
          {timeText && <span className="item-function-time">{timeText}</span>}
        </span>
        <span className="item-function-description">{description}</span>
      </button>
    );
  }

  return (
    <div className={`item-function ${fn.unlocked ? '' : 'locked'}`}>
      <span className="item-function-name">
        {fn.unlocked ? fn.name : `未解锁：${fn.name}`}
        {fn.unlocked && timeText && <span className="item-function-time">{timeText}</span>}
      </span>
      <span className="item-function-description">{description}</span>
    </div>
  );
}

function getTypeLabel(type: 'consumable' | 'equipment' | 'keyItem'): string {
  if (type === 'consumable') return '消耗';
  if (type === 'equipment') return '装备';
  return '关键';
}

function getQuantityModeLabel(mode: 'global' | 'countable' | null): string {
  return mode === 'countable' ? '计数' : '全局';
}

function getInventoryQuantityLabel(mode: 'global' | 'countable' | null, quantity: number): string {
  if (mode === 'countable') return `计数 x${quantity}`;
  return '全局唯一';
}
