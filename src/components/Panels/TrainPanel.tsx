import { useGameStore } from '@/store/useGameStore';
import { useSelectedTerritory } from '@/hooks/useSelectedTerritory';
import { UNIT_STATS } from '@/constants/gameConfig';
import { unitTypeName, unitTypeIcon, formatNumber } from '@/utils/formatters';
import type { UnitType } from '@/types';
import '@/styles/parchment.css';

const UNIT_TYPES: UnitType[] = ['militia', 'archer', 'knight', 'siege'];

export function TrainPanel() {
  const { territory } = useSelectedTerritory();
  const activeFactionId = useGameStore((s) => s.activeFactionId);
  const faction = useGameStore((s) => activeFactionId ? s.factions[activeFactionId] : null);

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
    const state = useGameStore.getState();
    const stats = UNIT_STATS[unitType];
    const cost = stats.cost;

    if (
      faction.resources.gold < cost.gold ||
      faction.resources.food < cost.food ||
      faction.resources.wood < cost.wood
    ) return;

    // Check tech requirement
    if ('requires' in stats && stats.requires) {
      if (!faction.techResearched.includes(stats.requires as string)) return;
    }

    state.updateFactionResources(activeFactionId!, {
      gold: -cost.gold,
      food: -cost.food,
      wood: -cost.wood,
    });
    state.enqueueTraining(activeFactionId!, territory.id, unitType, stats.trainTicks);
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
              <span style={{ color: '#6b5840' }}>{item.ticksRemaining} ticks</span>
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
                style={{ padding: '3px 10px', fontSize: '0.7rem' }}
                disabled={!canAfford || !hasRequirement}
                onClick={() => handleTrain(type)}
              >
                Recruter
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
