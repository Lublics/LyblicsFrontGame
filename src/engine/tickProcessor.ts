import { useGameStore } from '@/store/useGameStore';
import { processResources } from './resourceEngine';
import { processResearch } from './researchEngine';
import { processAITurns } from '@/ai/aiController';
import { checkVictoryConditions } from './victoryEngine';

export function endPlayerTurn() {
  const state = useGameStore.getState();
  if (state.phase !== 'player_turn') return;
  state.setPhase('ai_turn');
}

export function processEndOfRound() {
  // 1. Generate resources for all factions
  processResources();

  // 2. Advance training queues (1 step per round)
  useGameStore.getState().advanceTrainingQueues();

  // 3. Advance research (1 step per round)
  processResearch();

  // 4. Decay diplomatic penalties
  useGameStore.setState((s) => {
    Object.values(s.factions).forEach((faction) => {
      if (faction.diplomaticPenalty > 0) {
        faction.diplomaticPenalty -= 1;
      }
    });
  });

  // 5. Check victory conditions
  checkVictoryConditions();

  // 6. If game is still going, advance turn and start new player turn
  const state = useGameStore.getState();
  if (state.phase !== 'victory') {
    const turnNumber = state.turnNumber;
    state.clearOldNotifications(turnNumber - 10);
    state.incrementTurn();
    state.startPlayerTurn();
  }
}
