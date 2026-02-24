import { useGameStore } from '@/store/useGameStore';
import { processResources } from './resourceEngine';
import { processMovement } from './movement';
import { processResearch } from './researchEngine';
import { processAI } from '@/ai/aiController';
import { checkVictoryConditions } from './victoryEngine';

export function processTick() {
  const state = useGameStore.getState();
  if (state.phase !== 'playing') return;

  // 1. Increment tick
  state.incrementTick();

  // 2. Resource generation
  processResources();

  // 3. Training queues
  state.tickTrainingQueues();

  // 4. Movement / pending attacks
  processMovement();

  // 5. Research progression
  processResearch();

  // 6. AI evaluation
  processAI();

  // 7. Victory check
  checkVictoryConditions();

  // 8. Clean old notifications (keep last 50 ticks)
  const currentTick = useGameStore.getState().tick;
  state.clearOldNotifications(currentTick - 50);
}
