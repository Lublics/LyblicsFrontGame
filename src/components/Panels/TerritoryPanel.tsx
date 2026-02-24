import { useCallback, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useSelectedTerritory } from '@/hooks/useSelectedTerritory';
import { terrainName, regionName, unitTypeName, getTotalUnits, formatNumber } from '@/utils/formatters';
import { UNIT_STATS, MOVEMENT_TICKS } from '@/constants/gameConfig';
import type { UnitType, Army, TerritoryId } from '@/types';
import '@/styles/parchment.css';

let playerAttackCounter = 0;

export function TerritoryPanel() {
  const { territory, setSelected } = useSelectedTerritory();
  const factions = useGameStore((s) => s.factions);
  const activeFactionId = useGameStore((s) => s.activeFactionId);
  const territories = useGameStore((s) => s.territories);
  const [transferTarget, setTransferTarget] = useState<TerritoryId | null>(null);
  const [sendRatio, setSendRatio] = useState(0.5);

  if (!territory) {
    return (
      <div className="parchment-panel" style={{
        width: 280,
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6b5840',
        fontStyle: 'italic',
      }}>
        Sélectionnez un territoire
      </div>
    );
  }

  const owner = territory.owner ? factions[territory.owner] : null;
  const isOwned = territory.owner === activeFactionId;
  const adjacentTerritories = territory.adjacentIds.map((id) => territories[id]).filter(Boolean);

  const handleAttack = (targetId: TerritoryId) => {
    const state = useGameStore.getState();
    const target = territories[targetId];
    if (!target || !activeFactionId) return;

    const army: Army = {
      militia: Math.floor(territory.army.militia * sendRatio),
      archer: Math.floor(territory.army.archer * sendRatio),
      knight: Math.floor(territory.army.knight * sendRatio),
      siege: Math.floor(territory.army.siege * sendRatio),
    };

    if (getTotalUnits(army) < 1) return;

    // Remove from source
    state.setTerritoryArmy(territory.id, {
      militia: territory.army.militia - army.militia,
      archer: territory.army.archer - army.archer,
      knight: territory.army.knight - army.knight,
      siege: territory.army.siege - army.siege,
    });

    playerAttackCounter += 1;
    state.addPendingAttack({
      id: `attack-player-${playerAttackCounter}`,
      attackerFactionId: activeFactionId,
      fromTerritoryId: territory.id,
      toTerritoryId: targetId,
      army,
      ticksRemaining: MOVEMENT_TICKS,
    });

    setTransferTarget(null);
  };

  const handleTransferTroops = (targetId: TerritoryId) => {
    const state = useGameStore.getState();
    const target = territories[targetId];
    if (!target || target.owner !== activeFactionId) return;

    const army: Army = {
      militia: Math.floor(territory.army.militia * sendRatio),
      archer: Math.floor(territory.army.archer * sendRatio),
      knight: Math.floor(territory.army.knight * sendRatio),
      siege: Math.floor(territory.army.siege * sendRatio),
    };

    // Remove from source
    state.setTerritoryArmy(territory.id, {
      militia: territory.army.militia - army.militia,
      archer: territory.army.archer - army.archer,
      knight: territory.army.knight - army.knight,
      siege: territory.army.siege - army.siege,
    });

    // Add to target
    state.setTerritoryArmy(targetId, {
      militia: target.army.militia + army.militia,
      archer: target.army.archer + army.archer,
      knight: target.army.knight + army.knight,
      siege: target.army.siege + army.siege,
    });
  };

  return (
    <div className="parchment-panel" style={{ width: 280, padding: 12, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        {owner && (
          <span style={{
            width: 12, height: 12, borderRadius: '50%',
            background: owner.color, border: '1px solid rgba(0,0,0,0.2)',
          }} />
        )}
        <div className="parchment-heading" style={{ fontSize: '0.95rem' }}>
          {territory.name}
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', color: '#6b5840', marginBottom: 8 }}>
        {regionName(territory.region)} • {terrainName(territory.terrainType)}
        {territory.defenseBonus > 0 && (
          <span style={{ color: '#2e5e1a' }}> (+{Math.round(territory.defenseBonus * 100)}% def)</span>
        )}
      </div>

      <div className="parchment-divider" />

      {/* Owner info */}
      <div style={{ fontSize: '0.8rem', marginBottom: 4 }}>
        <strong>Propriétaire:</strong> {owner?.name ?? 'Neutre'}
      </div>

      {/* Resources */}
      <div style={{ fontSize: '0.8rem', marginBottom: 8 }}>
        <strong>Revenus/tick:</strong>
        <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
          <span>🪙 {territory.resourceGeneration.gold}</span>
          <span>🌾 {territory.resourceGeneration.food}</span>
          <span>🪵 {territory.resourceGeneration.wood}</span>
        </div>
      </div>

      <div className="parchment-divider" />

      {/* Army */}
      <div style={{ fontSize: '0.8rem', marginBottom: 8 }}>
        <strong>Garnison ({getTotalUnits(territory.army)})</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
          {(['militia', 'archer', 'knight', 'siege'] as UnitType[]).map((type) => (
            territory.army[type] > 0 && (
              <div key={type} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{unitTypeName(type)}</span>
                <span style={{ fontWeight: 600 }}>{territory.army[type]}</span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Actions for owned territories */}
      {isOwned && (
        <>
          <div className="parchment-divider" />

          {/* Send ratio slider */}
          <div style={{ fontSize: '0.8rem', marginBottom: 8 }}>
            <strong>Envoyer: {Math.round(sendRatio * 100)}%</strong>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.1"
              value={sendRatio}
              onChange={(e) => setSendRatio(parseFloat(e.target.value))}
              style={{ width: '100%', marginTop: 4 }}
            />
          </div>

          {/* Adjacent territories */}
          <div style={{ fontSize: '0.8rem' }}>
            <strong>Territoires adjacents:</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
              {adjacentTerritories.map((adj) => {
                const adjOwner = adj.owner ? factions[adj.owner] : null;
                const isFriendly = adj.owner === activeFactionId;
                return (
                  <div key={adj.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '3px 6px',
                    background: 'rgba(255,255,255,0.3)',
                    borderRadius: 3,
                    border: '1px solid rgba(139,115,85,0.2)',
                  }}>
                    {adjOwner && (
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: adjOwner.color,
                      }} />
                    )}
                    <span
                      style={{ flex: 1, cursor: 'pointer', fontSize: '0.73rem' }}
                      onClick={() => setSelected(adj.id)}
                    >
                      {adj.name}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#6b5840' }}>
                      ({getTotalUnits(adj.army)})
                    </span>
                    {isFriendly ? (
                      <button
                        className="parchment-btn"
                        style={{ padding: '1px 6px', fontSize: '0.6rem' }}
                        onClick={() => handleTransferTroops(adj.id)}
                      >
                        Envoyer
                      </button>
                    ) : (
                      <button
                        className="parchment-btn parchment-btn-danger"
                        style={{ padding: '1px 6px', fontSize: '0.6rem' }}
                        onClick={() => handleAttack(adj.id)}
                      >
                        Attaquer
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
