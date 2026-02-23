import type { Faction } from '@/types';
import { STARTING_RESOURCES, STARTING_ARMY } from './gameConfig';

export interface FactionTemplate {
  id: string;
  name: string;
  color: string;
  colorLight: string;
  description: string;
  startingTerritories: string[];
  aiStrategy: 'aggressive' | 'defensive' | 'expansionist';
}

export const FACTION_TEMPLATES: FactionTemplate[] = [
  {
    id: 'nordheim',
    name: 'Nordheim',
    color: '#4a7c9b',
    colorLight: '#7eb5d6',
    description: 'Les seigneurs des Highlands du Nord, endurcis par le froid.',
    startingTerritories: ['h1', 'h2'],
    aiStrategy: 'aggressive',
  },
  {
    id: 'valdoria',
    name: 'Valdoria',
    color: '#c4a535',
    colorLight: '#e8d26f',
    description: 'Le puissant royaume central, riche et prospère.',
    startingTerritories: ['k1', 'k2'],
    aiStrategy: 'defensive',
  },
  {
    id: 'sylvandis',
    name: 'Sylvandis',
    color: '#3a8a3a',
    colorLight: '#6bc46b',
    description: 'Les gardiens de la forêt de l\'ouest, maîtres de l\'arc.',
    startingTerritories: ['f1', 'f2'],
    aiStrategy: 'defensive',
  },
  {
    id: 'marenis',
    name: 'Marenis',
    color: '#7b4a8a',
    colorLight: '#b07cc4',
    description: 'Les marchands de la côte est, riches en commerce.',
    startingTerritories: ['c1', 'c2'],
    aiStrategy: 'expansionist',
  },
  {
    id: 'thornwall',
    name: 'Thornwall',
    color: '#8b4513',
    colorLight: '#c47a3f',
    description: 'Les survivants des marais du sud, rusés et tenaces.',
    startingTerritories: ['s1', 's2'],
    aiStrategy: 'aggressive',
  },
  {
    id: 'ironpeak',
    name: 'Ironpeak',
    color: '#6b6b6b',
    colorLight: '#a0a0a0',
    description: 'Les forgerons des plaines centrales, maîtres de l\'acier.',
    startingTerritories: ['p1', 'p2'],
    aiStrategy: 'expansionist',
  },
];

export function createFaction(template: FactionTemplate, isHuman: boolean): Faction {
  return {
    id: template.id,
    name: template.name,
    color: template.color,
    colorLight: template.colorLight,
    isHuman,
    resources: { ...STARTING_RESOURCES },
    territories: [...template.startingTerritories],
    techResearched: [],
    currentResearch: null,
    researchProgress: 0,
    trainingQueue: [],
    alive: true,
    aiStrategy: isHuman ? null : template.aiStrategy,
    diplomaticPenalty: 0,
  };
}
