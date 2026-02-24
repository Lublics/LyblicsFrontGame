import { useGameStore } from '@/store/useGameStore';
import { getWeakestAdjacentEnemy, getNeutralAdjacentTerritory, launchAttack, tryTrainUnit } from '../aiUtils';
import { AP_COST } from '@/constants/gameConfig';

export function executeAggressiveStrategy(factionId: string, ap: number): number {
  const state = useGameStore.getState();
  const faction = state.factions[factionId];
  if (!faction || ap <= 0) return 0;

  // Priority 1: Attack weakest neighbor if we have advantage
  if (ap >= AP_COST.attack) {
    const weakest = getWeakestAdjacentEnemy(factionId);
    if (weakest && weakest.ratio > 1.2) {
      launchAttack(factionId, weakest.fromId, weakest.toId, 0.7);
      ap -= AP_COST.attack;
    }
  }

  // Priority 2: Grab neutral territories
  if (ap >= AP_COST.attack) {
    const neutral = getNeutralAdjacentTerritory(factionId);
    if (neutral) {
      launchAttack(factionId, neutral.fromId, neutral.toId, 0.5);
      ap -= AP_COST.attack;
    }
  }

  // Priority 3: Train militia
  if (ap >= AP_COST.recruit && faction.territories.length > 0) {
    const trainTerritory = faction.territories[0];
    if (tryTrainUnit(factionId, trainTerritory, 'militia')) {
      ap -= AP_COST.recruit;
    }
  }

  // Priority 4: Start research if none active
  if (ap >= AP_COST.research && !faction.currentResearch) {
    if (faction.techResearched.length === 0) {
      state.startResearch(factionId, 'archery');
      ap -= AP_COST.research;
    } else if (!faction.techResearched.includes('horsemanship')) {
      state.startResearch(factionId, 'horsemanship');
      ap -= AP_COST.research;
    }
  }

  return ap;
}
