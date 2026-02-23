import { useEffect } from 'react';
import { startGameLoop, stopGameLoop } from './gameLoop';
import { useGameStore } from '@/store/useGameStore';

export function useGameLoop() {
  const phase = useGameStore((s) => s.phase);

  useEffect(() => {
    if (phase === 'playing') {
      startGameLoop();
    } else {
      stopGameLoop();
    }
    return () => stopGameLoop();
  }, [phase]);
}
