import { useGameStore } from '@/store/useGameStore';
import { TECH_TREE } from '@/constants/techTree';

export function processResearch() {
  useGameStore.setState((s) => {
    Object.values(s.factions).forEach((faction) => {
      if (!faction.alive || !faction.currentResearch) return;

      const tech = TECH_TREE.find((t) => t.id === faction.currentResearch);
      if (!tech) return;

      // Research speed based on gold (per round)
      const researchSpeed = Math.max(5, faction.resources.gold / 20);
      faction.researchProgress += researchSpeed;

      if (faction.researchProgress >= tech.cost) {
        faction.techResearched.push(tech.id);
        faction.currentResearch = null;
        faction.researchProgress = 0;

        s.notifications.push({
          id: `notif-research-${faction.id}-${tech.id}`,
          message: `${faction.name} a recherché ${tech.name}!`,
          type: 'research',
          turn: s.turnNumber,
          factionId: faction.id,
        });
      }
    });
  });
}
