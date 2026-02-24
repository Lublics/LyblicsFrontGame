import { useGameStore } from '@/store/useGameStore';
import { UNIT_STATS } from '@/constants/gameConfig';
import { resolveInstantAttack } from '@/engine/movement';
import type { Army, FactionId, TerritoryId, UnitType } from '@/types';

export function getArmyStrengthScore(army: Army): number {
  return (
    army.militia * UNIT_STATS.militia.attack +
    army.archer * UNIT_STATS.archer.attack +
    army.knight * UNIT_STATS.knight.attack +
    army.siege * UNIT_STATS.siege.attack
  );
}

export function getTotalUnits(army: Army): number {
  return army.militia + army.archer + army.knight + army.siege;
}

export function getWeakestAdjacentEnemy(factionId: FactionId): {
  fromId: TerritoryId;
  toId: TerritoryId;
  ratio: number;
} | null {
  const state = useGameStore.getState();
  const faction = state.factions[factionId];
  if (!faction) return null;

  let best: { fromId: TerritoryId; toId: TerritoryId; ratio: number } | null = null;

  faction.territories.forEach((tId) => {
    const territory = state.territories[tId];
    if (!territory) return;

    territory.adjacentIds.forEach((adjId) => {
      const adj = state.territories[adjId];
      if (!adj || adj.owner === factionId) return;

      const myStrength = getArmyStrengthScore(territory.army);
      const enemyStrength = getArmyStrengthScore(adj.army) * (1 + adj.defenseBonus);
      const ratio = myStrength / Math.max(enemyStrength, 0.1);

      if (!best || ratio > best.ratio) {
        best = { fromId: tId, toId: adjId, ratio };
      }
    });
  });

  return best;
}

export function getNeutralAdjacentTerritory(factionId: FactionId): {
  fromId: TerritoryId;
  toId: TerritoryId;
} | null {
  const state = useGameStore.getState();
  const faction = state.factions[factionId];
  if (!faction) return null;

  for (const tId of faction.territories) {
    const territory = state.territories[tId];
    if (!territory) continue;

    for (const adjId of territory.adjacentIds) {
      const adj = state.territories[adjId];
      if (adj && adj.owner === null && getTotalUnits(territory.army) > 3) {
        return { fromId: tId, toId: adjId };
      }
    }
  }
  return null;
}

export function launchAttack(factionId: FactionId, fromId: TerritoryId, toId: TerritoryId, ratio: number = 0.6) {
  const result = resolveInstantAttack(factionId, fromId, toId, ratio);

  const state = useGameStore.getState();
  const toTerritory = state.territories[toId];
  const faction = state.factions[factionId];

  state.addNotification({
    message: result.success
      ? `${faction?.name ?? 'IA'} a conquis ${toTerritory?.name ?? toId}!`
      : `L'attaque de ${faction?.name ?? 'IA'} sur ${toTerritory?.name ?? toId} a échoué.`,
    type: 'combat',
    turn: state.turnNumber,
    factionId,
  });
}

export function tryTrainUnit(factionId: FactionId, territoryId: TerritoryId, unitType: UnitType): boolean {
  const state = useGameStore.getState();
  const faction = state.factions[factionId];
  if (!faction) return false;

  const stats = UNIT_STATS[unitType];
  const cost = stats.cost;

  if (
    faction.resources.gold >= cost.gold &&
    faction.resources.food >= cost.food &&
    faction.resources.wood >= cost.wood
  ) {
    if ('requires' in stats && stats.requires) {
      if (!faction.techResearched.includes(stats.requires as string)) return false;
    }

    state.updateFactionResources(factionId, {
      gold: -cost.gold,
      food: -cost.food,
      wood: -cost.wood,
    });
    state.enqueueTraining(factionId, territoryId, unitType, stats.trainTurns);
    return true;
  }
  return false;
}
