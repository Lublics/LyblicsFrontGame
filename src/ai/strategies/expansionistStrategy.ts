import { useGameStore } from '@/store/useGameStore';
import { getWeakestAdjacentEnemy, getNeutralAdjacentTerritory, launchAttack, tryTrainUnit } from '../aiUtils';
import { AP_COST } from '@/constants/gameConfig';

export function executeExpansionistStrategy(factionId: string, ap: number): number {
  const state = useGameStore.getState();
  const faction = state.factions[factionId];
  if (!faction || ap <= 0) return 0;

  // Priority 1: Grab neutral territories first
  if (ap >= AP_COST.attack) {
    const neutral = getNeutralAdjacentTerritory(factionId);
    if (neutral) {
      launchAttack(factionId, neutral.fromId, neutral.toId, 0.5);
      ap -= AP_COST.attack;
    }
  }

  // Priority 2: Attack weak neighbors
  if (ap >= AP_COST.attack) {
    const weakest = getWeakestAdjacentEnemy(factionId);
    if (weakest && weakest.ratio > 1.5) {
      launchAttack(factionId, weakest.fromId, weakest.toId, 0.6);
      ap -= AP_COST.attack;
    }
  }

  // Priority 3: Train to maintain forces
  if (ap >= AP_COST.recruit && faction.territories.length > 0) {
    const trainTerritory = faction.territories[Math.floor(Math.random() * faction.territories.length)];
    if (tryTrainUnit(factionId, trainTerritory, 'militia')) {
      ap -= AP_COST.recruit;
    }
  }

  // Research: focus on economy for growth
  if (ap >= AP_COST.research && !faction.currentResearch) {
    if (!faction.techResearched.includes('mining')) {
      state.startResearch(factionId, 'mining');
      ap -= AP_COST.research;
    } else if (!faction.techResearched.includes('agriculture')) {
      state.startResearch(factionId, 'agriculture');
      ap -= AP_COST.research;
    } else if (!faction.techResearched.includes('archery')) {
      state.startResearch(factionId, 'archery');
      ap -= AP_COST.research;
    }
  }

  return ap;
}
