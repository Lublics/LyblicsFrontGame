export type FactionId = string;
export type TerritoryId = string;

export interface Resources {
  gold: number;
  food: number;
  wood: number;
}

export interface ResourceGeneration {
  gold: number;
  food: number;
  wood: number;
}

export type UnitType = 'militia' | 'archer' | 'knight' | 'siege';

export interface Army {
  militia: number;
  archer: number;
  knight: number;
  siege: number;
}

export interface TrainingQueueItem {
  unitType: UnitType;
  turnsRemaining: number;
  territoryId: TerritoryId;
}

export interface Territory {
  id: TerritoryId;
  name: string;
  region: Region;
  svgPath: string;
  center: { x: number; y: number };
  adjacentIds: TerritoryId[];
  owner: FactionId | null;
  army: Army;
  resourceGeneration: ResourceGeneration;
  terrainType: TerrainType;
  defenseBonus: number;
}

export type TerrainType = 'plains' | 'forest' | 'hills' | 'mountains' | 'swamp' | 'coastal' | 'fortress';

export type Region =
  | 'highlands_north'
  | 'central_plains'
  | 'east_coast'
  | 'west_forest'
  | 'south_swamp'
  | 'central_kingdom';

export interface Faction {
  id: FactionId;
  name: string;
  color: string;
  colorLight: string;
  isHuman: boolean;
  resources: Resources;
  territories: TerritoryId[];
  techResearched: string[];
  currentResearch: string | null;
  researchProgress: number;
  trainingQueue: TrainingQueueItem[];
  alive: boolean;
  aiStrategy: 'aggressive' | 'defensive' | 'expansionist' | null;
  diplomaticPenalty: number;
}

export type GamePhase = 'menu' | 'setup' | 'player_turn' | 'ai_turn' | 'victory';

export interface GameState {
  phase: GamePhase;
  turnNumber: number;
  territories: Record<TerritoryId, Territory>;
  factions: Record<FactionId, Faction>;
  activeFactionId: FactionId | null;
  selectedTerritoryId: TerritoryId | null;
  notifications: Notification[];
  victoryCondition: VictoryCondition;
  winner: FactionId | null;
  actionPoints: number;
  maxActionPoints: number;
  currentTurnFactionId: FactionId | null;
}

export interface Notification {
  id: string;
  message: string;
  type: 'combat' | 'diplomacy' | 'research' | 'resource' | 'victory';
  turn: number;
  factionId?: FactionId;
}

export type VictoryCondition = 'domination' | 'elimination' | 'economic';

export interface CombatResult {
  attackerLosses: Army;
  defenderLosses: Army;
  attackerWon: boolean;
  territoryId: TerritoryId;
}
