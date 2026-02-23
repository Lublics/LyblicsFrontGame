import { useGameStore } from '@/store/useGameStore';
import { getWeakestAdjacentEnemy, getNeutralAdjacentTerritory, launchAttack, tryTrainUnit } from '../aiUtils';

export function executeDefensiveStrategy(factionId: string, actionsRemaining: number): number {
  const state = useGameStore.getState();
  const faction = state.factions[factionId];
  if (!faction || actionsRemaining <= 0) return 0;

  // Priority 1: Train troops (defensive focus)
  if (actionsRemaining > 0 && faction.territories.length > 0) {
    const trainTerritory = faction.territories[Math.floor(Math.random() * faction.territories.length)];
    if (tryTrainUnit(factionId, trainTerritory, 'militia')) {
      actionsRemaining--;
    }
  }

  // Priority 2: Only attack if 2:1 advantage
  const weakest = getWeakestAdjacentEnemy(factionId);
  if (weakest && weakest.ratio > 2.0 && actionsRemaining > 0) {
    launchAttack(factionId, weakest.fromId, weakest.toId, 0.5);
    actionsRemaining--;
  }

  // Priority 3: Grab neutral if safe
  if (actionsRemaining > 0) {
    const neutral = getNeutralAdjacentTerritory(factionId);
    if (neutral) {
      launchAttack(factionId, neutral.fromId, neutral.toId, 0.4);
      actionsRemaining--;
    }
  }

  // Research: focus on defense and economy
  if (!faction.currentResearch) {
    if (!faction.techResearched.includes('agriculture')) {
      state.startResearch(factionId, 'agriculture');
    } else if (!faction.techResearched.includes('fortification') && faction.techResearched.includes('horsemanship')) {
      state.startResearch(factionId, 'fortification');
    } else if (!faction.techResearched.includes('horsemanship')) {
      state.startResearch(factionId, 'horsemanship');
    }
  }

  return actionsRemaining;
}
