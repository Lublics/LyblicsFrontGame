import { useGameStore } from '@/store/useGameStore';
import { RESOURCE_MULTIPLIER } from '@/constants/gameConfig';

export function processResources() {
  const state = useGameStore.getState();

  Object.values(state.factions).forEach((faction) => {
    if (!faction.alive) return;

    let goldIncome = 0;
    let foodIncome = 0;
    let woodIncome = 0;

    faction.territories.forEach((tId) => {
      const territory = state.territories[tId];
      if (!territory) return;
      goldIncome += territory.resourceGeneration.gold * RESOURCE_MULTIPLIER;
      foodIncome += territory.resourceGeneration.food * RESOURCE_MULTIPLIER;
      woodIncome += territory.resourceGeneration.wood * RESOURCE_MULTIPLIER;
    });

    // Tech bonuses
    if (faction.techResearched.includes('agriculture')) foodIncome *= 1.25;
    if (faction.techResearched.includes('irrigation')) foodIncome *= 1.25;
    if (faction.techResearched.includes('mining')) goldIncome *= 1.25;
    if (faction.techResearched.includes('deep_mining')) goldIncome *= 1.25;
    if (faction.techResearched.includes('forestry')) woodIncome *= 1.25;
    if (faction.techResearched.includes('sawmills')) woodIncome *= 1.25;
    if (faction.techResearched.includes('taxation')) goldIncome *= 1.15;

    state.updateFactionResources(faction.id, {
      gold: goldIncome,
      food: foodIncome,
      wood: woodIncome,
    });
  });
}
