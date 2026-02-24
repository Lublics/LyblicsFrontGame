import { useGameStore } from '@/store/useGameStore';
import { UNIT_STATS, MOVEMENT_TICKS } from '@/constants/gameConfig';
import type { Army, FactionId, TerritoryId, UnitType } from '@/types';

let attackIdCounter = 0;

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
  const state = useGameStore.getState();
  const territory = state.territories[fromId];
  if (!territory) return;

  // Send a portion of the army
  const sendRatio = Math.min(ratio, 0.8);
  const army: Army = {
    militia: Math.floor(territory.army.militia * sendRatio),
    archer: Math.floor(territory.army.archer * sendRatio),
    knight: Math.floor(territory.army.knight * sendRatio),
    siege: Math.floor(territory.army.siege * sendRatio),
  };

  if (getTotalUnits(army) < 1) return;

  // Remove troops from origin
  state.setTerritoryArmy(fromId, {
    militia: territory.army.militia - army.militia,
    archer: territory.army.archer - army.archer,
    knight: territory.army.knight - army.knight,
    siege: territory.army.siege - army.siege,
  });

  attackIdCounter += 1;
  state.addPendingAttack({
    id: `attack-ai-${attackIdCounter}`,
    attackerFactionId: factionId,
    fromTerritoryId: fromId,
    toTerritoryId: toId,
    army,
    ticksRemaining: MOVEMENT_TICKS,
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
    // Check tech requirement
    if ('requires' in stats && stats.requires) {
      if (!faction.techResearched.includes(stats.requires as string)) return false;
    }

    state.updateFactionResources(factionId, {
      gold: -cost.gold,
      food: -cost.food,
      wood: -cost.wood,
    });
    state.enqueueTraining(factionId, territoryId, unitType, stats.trainTicks);
    return true;
  }
  return false;
}
