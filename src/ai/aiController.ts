import { useGameStore } from '@/store/useGameStore';
import { AI_EVAL_INTERVAL, AI_MAX_ACTIONS_PER_TICK } from '@/constants/gameConfig';
import { executeAggressiveStrategy } from './strategies/aggressiveStrategy';
import { executeDefensiveStrategy } from './strategies/defensiveStrategy';
import { executeExpansionistStrategy } from './strategies/expansionistStrategy';

export function processAI() {
  const state = useGameStore.getState();
  if (state.tick % AI_EVAL_INTERVAL !== 0) return;

  Object.values(state.factions).forEach((faction) => {
    if (!faction.alive || faction.isHuman) return;

    let actionsRemaining = AI_MAX_ACTIONS_PER_TICK;

    switch (faction.aiStrategy) {
      case 'aggressive':
        actionsRemaining = executeAggressiveStrategy(faction.id, actionsRemaining);
        break;
      case 'defensive':
        actionsRemaining = executeDefensiveStrategy(faction.id, actionsRemaining);
        break;
      case 'expansionist':
        actionsRemaining = executeExpansionistStrategy(faction.id, actionsRemaining);
        break;
    }
  });
}
