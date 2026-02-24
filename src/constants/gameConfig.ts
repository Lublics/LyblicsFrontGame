export const UNIT_STATS = {
  militia: { attack: 1, defense: 1, cost: { gold: 10, food: 5, wood: 0 }, trainTurns: 1 },
  archer: { attack: 2, defense: 1, cost: { gold: 20, food: 5, wood: 10 }, trainTurns: 2, requires: 'archery' },
  knight: { attack: 4, defense: 3, cost: { gold: 40, food: 10, wood: 0 }, trainTurns: 3, requires: 'horsemanship' },
  siege: { attack: 6, defense: 1, cost: { gold: 60, food: 5, wood: 30 }, trainTurns: 4, requires: 'siege_warfare' },
} as const;

export const TERRAIN_DEFENSE_BONUS: Record<string, number> = {
  plains: 0,
  forest: 0.15,
  hills: 0.2,
  mountains: 0.35,
  swamp: 0.1,
  coastal: 0.05,
  fortress: 0.4,
};

export const COMBAT_VARIANCE = 0.15; // +/-15%

export const MAX_ACTION_POINTS = 5;
export const AI_MAX_AP = 5;

export const AP_COST = {
  attack: 2,
  recruit: 1,
  research: 1,
  diplomacy: 1,
  transfer: 1,
} as const;

export const RESOURCE_MULTIPLIER = 5; // resources per round multiplier

export const BETRAYAL_PENALTY_TURNS = 10;
export const BETRAYAL_DIPLOMACY_MALUS = 0.5;

export const VICTORY_DOMINATION_THRESHOLD = 0.7;
export const VICTORY_ECONOMIC_GOLD = 5000;

export const MAP_WIDTH = 1200;
export const MAP_HEIGHT = 800;

export const STARTING_RESOURCES = { gold: 100, food: 50, wood: 50 };
export const STARTING_ARMY = { militia: 5, archer: 0, knight: 0, siege: 0 };
