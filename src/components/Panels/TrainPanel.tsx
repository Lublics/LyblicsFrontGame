import { useGameStore } from '@/store/useGameStore';
import { useSelectedTerritory } from '@/hooks/useSelectedTerritory';
import { UNIT_STATS, AP_COST } from '@/constants/gameConfig';
import { spendAP } from '@/engine/actionPoints';
import { unitTypeName, unitTypeIcon } from '@/utils/formatters';
import type { UnitType } from '@/types';
import '@/styles/parchment.css';

const UNIT_TYPES: UnitType[] = ['militia', 'archer', 'knight', 'siege'];

export function TrainPanel() {
  const { territory } = useSelectedTerritory();
  const activeFactionId = useGameStore((s) => s.activeFactionId);
  const faction = useGameStore((s) => activeFactionId ? s.factions[activeFactionId] : null);
  const actionPoints = useGameStore((s) => s.actionPoints);
  const phase = useGameStore((s) => s.phase);

  const isPlayerTurn = phase === 'player_turn';

  if (!territory || !faction || territory.owner !== activeFactionId) {
    return (
      <div className="parchment-panel" style={{
        width: 280,
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6b5840',
        fontStyle: 'italic',
        fontSize: '0.8rem',
      }}>
        {!territory
          ? 'Sélectionnez un territoire pour recruter'
          : territory.owner !== activeFactionId
            ? 'Vous ne contrôlez pas ce territoire'
            : 'Aucune faction active'}
      </div>
    );
  }

  const handleTrain = (unitType: UnitType) => {
    if (!isPlayerTurn || !activeFactionId) return;

    const stats = UNIT_STATS[unitType];
    const cost = stats.cost;

    const currentFaction = useGameStore.getState().factions[activeFactionId];
    if (!currentFaction) return;

    if (
      currentFaction.resources.gold < cost.gold ||
      currentFaction.resources.food < cost.food ||
      currentFaction.resources.wood < cost.wood
    ) return;

    if ('requires' in stats && stats.requires) {
      if (!currentFaction.techResearched.includes(stats.requires as string)) return;
    }

    if (!spendAP(AP_COST.recruit)) return;

    const state = useGameStore.getState();
    state.updateFactionResources(activeFactionId, {
      gold: -cost.gold,
      food: -cost.food,
      wood: -cost.wood,
    });
    state.enqueueTraining(activeFactionId, territory.id, unitType, stats.trainTurns);
  };

  const queueForTerritory = faction.trainingQueue.filter((q) => q.territoryId === territory.id);

  return (
    <div className="parchment-panel" style={{
      width: 280,
      padding: 12,
    }}>
      <div className="parchment-heading" style={{ fontSize: '0.85rem', marginBottom: 8 }}>
        Entraînement — {territory.name}
      </div>

      {/* Training queue */}
      {queueForTerritory.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>En cours:</div>
          {queueForTerritory.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.73rem',
              padding: '2px 4px',
              background: 'rgba(255,255,255,0.3)',
              borderRadius: 2,
              marginBottom: 2,
            }}>
              <span>{unitTypeIcon(item.unitType)} {unitTypeName(item.unitType)}</span>
              <span style={{ color: '#6b5840' }}>{item.turnsRemaining} tour{item.turnsRemaining > 1 ? 's' : ''}</span>
            </div>
          ))}
          <div className="parchment-divider" />
        </div>
      )}

      {/* Available units */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {UNIT_TYPES.map((type) => {
          const stats = UNIT_STATS[type];
          const cost = stats.cost;
          const hasRequirement = !('requires' in stats) || !stats.requires || faction.techResearched.includes(stats.requires as string);
          const canAfford =
            faction.resources.gold >= cost.gold &&
            faction.resources.food >= cost.food &&
            faction.resources.wood >= cost.wood;

          return (
            <div key={type} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 8px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 3,
              border: '1px solid rgba(139,115,85,0.2)',
              opacity: hasRequirement ? 1 : 0.4,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                  {unitTypeIcon(type)} {unitTypeName(type)}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#6b5840', display: 'flex', gap: 6 }}>
                  <span>⚔{stats.attack}</span>
                  <span>🛡{stats.defense}</span>
                  <span>🪙{cost.gold}</span>
                  {cost.food > 0 && <span>🌾{cost.food}</span>}
                  {cost.wood > 0 && <span>🪵{cost.wood}</span>}
                </div>
                {!hasRequirement && 'requires' in stats && (
                  <div style={{ fontSize: '0.6rem', color: '#8b2500' }}>
                    Nécessite: {stats.requires}
                  </div>
                )}
              </div>
              <button
                className="parchment-btn parchment-btn-primary"
                style={{ padding: '3px 8px', fontSize: '0.65rem' }}
                disabled={!canAfford || !hasRequirement || !isPlayerTurn || actionPoints < AP_COST.recruit}
                onClick={() => handleTrain(type)}
              >
                Recruter ({AP_COST.recruit})
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
