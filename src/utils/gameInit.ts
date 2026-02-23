import { useGameStore } from '@/store/useGameStore';
import { createTerritories } from '@/constants/territories';
import { FACTION_TEMPLATES, createFaction } from '@/constants/factions';
import type { Faction, Territory, Army } from '@/types';
import { STARTING_ARMY } from '@/constants/gameConfig';

export interface GameSetupConfig {
  humanFactionIds: string[]; // which factions are human-controlled
  enabledFactionIds: string[]; // which factions are in the game
}

export function initializeGame(config: GameSetupConfig) {
  const store = useGameStore.getState();

  // Create territories
  const territories = createTerritories();

  // Create factions
  const factions: Record<string, Faction> = {};
  FACTION_TEMPLATES.forEach((template) => {
    if (!config.enabledFactionIds.includes(template.id)) return;
    const isHuman = config.humanFactionIds.includes(template.id);
    factions[template.id] = createFaction(template, isHuman);
  });

  // Assign starting territories properly
  Object.values(territories).forEach((territory) => {
    if (territory.owner && factions[territory.owner]) {
      territory.army = { ...STARTING_ARMY };
    } else if (territory.owner && !factions[territory.owner]) {
      // Faction not in game, make territory neutral
      territory.owner = null;
      territory.army = { militia: 2, archer: 0, knight: 0, siege: 0 };
    }
  });

  // Set active faction to first human faction
  store.initGame(territories, factions);
  if (config.humanFactionIds.length > 0) {
    store.setActiveFaction(config.humanFactionIds[0]);
  }
}
