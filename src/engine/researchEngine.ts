import { useGameStore } from '@/store/useGameStore';
import { TECH_TREE } from '@/constants/techTree';

export function processResearch() {
  const state = useGameStore.getState();

  Object.values(state.factions).forEach((faction) => {
    if (!faction.alive || !faction.currentResearch) return;

    const tech = TECH_TREE.find((t) => t.id === faction.currentResearch);
    if (!tech) return;

    // Research speed based on gold (1 point per 10 gold per tick, min 0.5)
    const researchSpeed = Math.max(0.5, faction.resources.gold / 100);
    state.advanceResearch(faction.id, researchSpeed);

    // Check if research complete
    const freshFaction = useGameStore.getState().factions[faction.id];
    if (freshFaction && freshFaction.researchProgress >= tech.cost) {
      state.completeResearch(faction.id, tech.id);
      state.addNotification({
        message: `${faction.name} a recherché ${tech.name}!`,
        type: 'research',
        tick: state.tick,
        factionId: faction.id,
      });
    }
  });
}
