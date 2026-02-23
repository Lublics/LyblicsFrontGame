export const TICK_RATE_MS = 500; // ms per tick (2 ticks/sec)
export const MAX_TICKS_PER_FRAME = 3; // prevent spiral of death

export const UNIT_STATS = {
  militia: { attack: 1, defense: 1, cost: { gold: 10, food: 5, wood: 0 }, trainTicks: 3 },
  archer: { attack: 2, defense: 1, cost: { gold: 20, food: 5, wood: 10 }, trainTicks: 5, requires: 'archery' },
  knight: { attack: 4, defense: 3, cost: { gold: 40, food: 10, wood: 0 }, trainTicks: 8, requires: 'horsemanship' },
  siege: { attack: 6, defense: 1, cost: { gold: 60, food: 5, wood: 30 }, trainTicks: 12, requires: 'siege_warfare' },
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

export const COMBAT_VARIANCE = 0.15; // ±15%
export const MOVEMENT_TICKS = 2; // ticks to move between adjacent territories

export const AI_EVAL_INTERVAL = 3; // AI evaluates every N ticks
export const AI_MAX_ACTIONS_PER_TICK = 2;

export const BETRAYAL_PENALTY_TICKS = 60;
export const BETRAYAL_DIPLOMACY_MALUS = 0.5; // 50% less effective

export const VICTORY_DOMINATION_THRESHOLD = 0.7; // 70% of territories
export const VICTORY_ECONOMIC_GOLD = 5000;

export const MAP_WIDTH = 1200;
export const MAP_HEIGHT = 800;

export const STARTING_RESOURCES = { gold: 100, food: 50, wood: 50 };
export const STARTING_ARMY = { militia: 5, archer: 0, knight: 0, siege: 0 };
