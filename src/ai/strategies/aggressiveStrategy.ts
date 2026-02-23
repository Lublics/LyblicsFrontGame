import { useGameStore } from '@/store/useGameStore';
import { getWeakestAdjacentEnemy, getNeutralAdjacentTerritory, launchAttack, tryTrainUnit } from '../aiUtils';

export function executeAggressiveStrategy(factionId: string, actionsRemaining: number): number {
  const state = useGameStore.getState();
  const faction = state.factions[factionId];
  if (!faction || actionsRemaining <= 0) return 0;

  // Priority 1: Attack weakest neighbor if we have advantage
  const weakest = getWeakestAdjacentEnemy(factionId);
  if (weakest && weakest.ratio > 1.2 && actionsRemaining > 0) {
    launchAttack(factionId, weakest.fromId, weakest.toId, 0.7);
    actionsRemaining--;
  }

  // Priority 2: Grab neutral territories
  if (actionsRemaining > 0) {
    const neutral = getNeutralAdjacentTerritory(factionId);
    if (neutral) {
      launchAttack(factionId, neutral.fromId, neutral.toId, 0.5);
      actionsRemaining--;
    }
  }

  // Priority 3: Train militia if we can
  if (actionsRemaining > 0 && faction.territories.length > 0) {
    const trainTerritory = faction.territories[0];
    tryTrainUnit(factionId, trainTerritory, 'militia');
  }

  // Start research if none active
  if (!faction.currentResearch && faction.techResearched.length === 0) {
    state.startResearch(factionId, 'archery');
  } else if (!faction.currentResearch && !faction.techResearched.includes('horsemanship')) {
    state.startResearch(factionId, 'horsemanship');
  }

  return actionsRemaining;
}
