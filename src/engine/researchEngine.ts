import { useGameStore } from '@/store/useGameStore';
import { TECH_TREE } from '@/constants/techTree';

export function processResearch() {
  useGameStore.setState((s) => {
    Object.values(s.factions).forEach((faction) => {
      if (!faction.alive || !faction.currentResearch) return;

      const tech = TECH_TREE.find((t) => t.id === faction.currentResearch);
      if (!tech) return;

      // Research speed based on gold (1 point per 100 gold per tick, min 0.5)
      const researchSpeed = Math.max(0.5, faction.resources.gold / 100);
      faction.researchProgress += researchSpeed;

      // Check if research complete
      if (faction.researchProgress >= tech.cost) {
        faction.techResearched.push(tech.id);
        faction.currentResearch = null;
        faction.researchProgress = 0;

        s.notifications.push({
          id: `notif-research-${faction.id}-${tech.id}`,
          message: `${faction.name} a recherché ${tech.name}!`,
          type: 'research',
          tick: s.tick,
          factionId: faction.id,
        });
      }
    });
  });
}
