import { useGameStore } from '@/store/useGameStore';
import { VICTORY_DOMINATION_THRESHOLD, VICTORY_ECONOMIC_GOLD } from '@/constants/gameConfig';

export function checkVictoryConditions() {
  const state = useGameStore.getState();
  if (state.winner) return;

  const totalTerritories = Object.keys(state.territories).length;
  const aliveFactions = Object.values(state.factions).filter((f) => f.alive);

  // Elimination: last faction standing
  if (aliveFactions.length === 1) {
    state.setWinner(aliveFactions[0].id, 'elimination');
    return;
  }

  for (const faction of aliveFactions) {
    // Domination: control ≥70% of territories
    if (faction.territories.length / totalTerritories >= VICTORY_DOMINATION_THRESHOLD) {
      state.setWinner(faction.id, 'domination');
      return;
    }

    // Economic: accumulate X gold
    if (faction.resources.gold >= VICTORY_ECONOMIC_GOLD) {
      state.setWinner(faction.id, 'economic');
      return;
    }
  }
}
