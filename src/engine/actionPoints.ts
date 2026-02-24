import { useGameStore } from '@/store/useGameStore';

export function spendAP(cost: number): boolean {
  const state = useGameStore.getState();
  if (state.phase !== 'player_turn' || state.actionPoints < cost) return false;
  useGameStore.setState((s) => { s.actionPoints -= cost; });
  return true;
}
