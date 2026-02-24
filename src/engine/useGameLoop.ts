import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { processAITurns } from '@/ai/aiController';
import { processEndOfRound } from './tickProcessor';

export function useGameLoop() {
  const phase = useGameStore((s) => s.phase);

  useEffect(() => {
    if (phase === 'ai_turn') {
      // Brief delay so the player sees the "AI turn" overlay
      const timer = setTimeout(() => {
        processAITurns();
        processEndOfRound();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [phase]);
}
