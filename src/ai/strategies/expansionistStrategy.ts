import { useGameStore } from '@/store/useGameStore';
import { getWeakestAdjacentEnemy, getNeutralAdjacentTerritory, launchAttack, tryTrainUnit } from '../aiUtils';

export function executeExpansionistStrategy(factionId: string, actionsRemaining: number): number {
  const state = useGameStore.getState();
  const faction = state.factions[factionId];
  if (!faction || actionsRemaining <= 0) return 0;

  // Priority 1: Grab neutral territories first
  if (actionsRemaining > 0) {
    const neutral = getNeutralAdjacentTerritory(factionId);
    if (neutral) {
      launchAttack(factionId, neutral.fromId, neutral.toId, 0.5);
      actionsRemaining--;
    }
  }

  // Priority 2: Attack weak neighbors
  if (actionsRemaining > 0) {
    const weakest = getWeakestAdjacentEnemy(factionId);
    if (weakest && weakest.ratio > 1.5) {
      launchAttack(factionId, weakest.fromId, weakest.toId, 0.6);
      actionsRemaining--;
    }
  }

  // Priority 3: Train to maintain forces
  if (actionsRemaining > 0 && faction.territories.length > 0) {
    const trainTerritory = faction.territories[Math.floor(Math.random() * faction.territories.length)];
    tryTrainUnit(factionId, trainTerritory, 'militia');
  }

  // Research: focus on economy for growth
  if (!faction.currentResearch) {
    if (!faction.techResearched.includes('mining')) {
      state.startResearch(factionId, 'mining');
    } else if (!faction.techResearched.includes('agriculture')) {
      state.startResearch(factionId, 'agriculture');
    } else if (!faction.techResearched.includes('archery')) {
      state.startResearch(factionId, 'archery');
    }
  }

  return actionsRemaining;
}
