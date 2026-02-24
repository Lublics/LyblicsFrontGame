import { useGameStore } from '@/store/useGameStore';
import { getWeakestAdjacentEnemy, getNeutralAdjacentTerritory, launchAttack, tryTrainUnit } from '../aiUtils';
import { AP_COST } from '@/constants/gameConfig';

export function executeDefensiveStrategy(factionId: string, ap: number): number {
  const state = useGameStore.getState();
  const faction = state.factions[factionId];
  if (!faction || ap <= 0) return 0;

  // Priority 1: Train troops (defensive focus) — train multiple times
  while (ap >= AP_COST.recruit && faction.territories.length > 0) {
    const trainTerritory = faction.territories[Math.floor(Math.random() * faction.territories.length)];
    if (tryTrainUnit(factionId, trainTerritory, 'militia')) {
      ap -= AP_COST.recruit;
    } else {
      break;
    }
    if (ap < AP_COST.recruit) break;
    // Train max 3 units per turn
    const freshFaction = useGameStore.getState().factions[factionId];
    if (!freshFaction || freshFaction.trainingQueue.length >= 3) break;
  }

  // Priority 2: Only attack if 2:1 advantage
  if (ap >= AP_COST.attack) {
    const weakest = getWeakestAdjacentEnemy(factionId);
    if (weakest && weakest.ratio > 2.0) {
      launchAttack(factionId, weakest.fromId, weakest.toId, 0.5);
      ap -= AP_COST.attack;
    }
  }

  // Priority 3: Grab neutral if safe
  if (ap >= AP_COST.attack) {
    const neutral = getNeutralAdjacentTerritory(factionId);
    if (neutral) {
      launchAttack(factionId, neutral.fromId, neutral.toId, 0.4);
      ap -= AP_COST.attack;
    }
  }

  // Research: focus on defense and economy
  if (ap >= AP_COST.research && !faction.currentResearch) {
    if (!faction.techResearched.includes('agriculture')) {
      state.startResearch(factionId, 'agriculture');
      ap -= AP_COST.research;
    } else if (!faction.techResearched.includes('horsemanship')) {
      state.startResearch(factionId, 'horsemanship');
      ap -= AP_COST.research;
    } else if (faction.techResearched.includes('horsemanship') && !faction.techResearched.includes('fortification')) {
      state.startResearch(factionId, 'fortification');
      ap -= AP_COST.research;
    }
  }

  return ap;
}
