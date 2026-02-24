import { useGameStore } from '@/store/useGameStore';
import { AI_MAX_AP } from '@/constants/gameConfig';
import { executeAggressiveStrategy } from './strategies/aggressiveStrategy';
import { executeDefensiveStrategy } from './strategies/defensiveStrategy';
import { executeExpansionistStrategy } from './strategies/expansionistStrategy';

export function processAITurns() {
  const state = useGameStore.getState();

  Object.values(state.factions).forEach((faction) => {
    if (!faction.alive || faction.isHuman) return;
    processAIFactionTurn(faction.id);
  });
}

function processAIFactionTurn(factionId: string) {
  const state = useGameStore.getState();
  const faction = state.factions[factionId];
  if (!faction || !faction.alive || faction.isHuman) return;

  let ap = AI_MAX_AP;

  switch (faction.aiStrategy) {
    case 'aggressive':
      ap = executeAggressiveStrategy(factionId, ap);
      break;
    case 'defensive':
      ap = executeDefensiveStrategy(factionId, ap);
      break;
    case 'expansionist':
      ap = executeExpansionistStrategy(factionId, ap);
      break;
  }
}
