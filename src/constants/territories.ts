import type { Territory, Region, TerrainType } from '@/types';
import { TERRAIN_DEFENSE_BONUS } from './gameConfig';

interface TerritoryDef {
  id: string;
  name: string;
  region: Region;
  svgPath: string;
  center: { x: number; y: number };
  adjacentIds: string[];
  terrainType: TerrainType;
  resourceGeneration: { gold: number; food: number; wood: number };
  owner: string | null;
}

// 35 territories across 6 regions on a 1200x800 map
const TERRITORY_DEFS: TerritoryDef[] = [
  // ========== HIGHLANDS NORTH (6 territories, top area) ==========
  {
    id: 'h1', name: 'Pic du Givre', region: 'highlands_north', terrainType: 'mountains',
    svgPath: 'M 50,20 L 130,15 L 165,50 L 180,110 L 140,130 L 80,120 L 40,80 Z',
    center: { x: 110, y: 70 }, adjacentIds: ['h2', 'h3'],
    resourceGeneration: { gold: 3, food: 1, wood: 1 }, owner: 'nordheim',
  },
  {
    id: 'h2', name: 'Val de Brume', region: 'highlands_north', terrainType: 'hills',
    svgPath: 'M 180,110 L 165,50 L 230,25 L 310,40 L 320,100 L 270,130 L 200,130 Z',
    center: { x: 245, y: 80 }, adjacentIds: ['h1', 'h3', 'h4', 'p1'],
    resourceGeneration: { gold: 2, food: 2, wood: 2 }, owner: 'nordheim',
  },
  {
    id: 'h3', name: 'Crête du Vent', region: 'highlands_north', terrainType: 'mountains',
    svgPath: 'M 40,80 L 80,120 L 140,130 L 200,130 L 180,180 L 110,200 L 30,170 L 20,120 Z',
    center: { x: 100, y: 150 }, adjacentIds: ['h1', 'h2', 'h5', 'f1'],
    resourceGeneration: { gold: 2, food: 1, wood: 2 }, owner: null,
  },
  {
    id: 'h4', name: 'Fort Neigeux', region: 'highlands_north', terrainType: 'fortress',
    svgPath: 'M 320,100 L 310,40 L 400,20 L 460,50 L 450,110 L 380,130 L 330,120 Z',
    center: { x: 385, y: 75 }, adjacentIds: ['h2', 'h6', 'p1', 'p2'],
    resourceGeneration: { gold: 3, food: 1, wood: 1 }, owner: null,
  },
  {
    id: 'h5', name: 'Lac Gelé', region: 'highlands_north', terrainType: 'hills',
    svgPath: 'M 30,170 L 110,200 L 130,260 L 70,280 L 20,250 Z',
    center: { x: 70, y: 230 }, adjacentIds: ['h3', 'f1', 'f2'],
    resourceGeneration: { gold: 1, food: 3, wood: 1 }, owner: null,
  },
  {
    id: 'h6', name: 'Col de l\'Aigle', region: 'highlands_north', terrainType: 'mountains',
    svgPath: 'M 460,50 L 540,30 L 600,60 L 590,120 L 530,140 L 450,110 Z',
    center: { x: 530, y: 85 }, adjacentIds: ['h4', 'p2', 'p3', 'c1'],
    resourceGeneration: { gold: 2, food: 1, wood: 1 }, owner: null,
  },

  // ========== CENTRAL PLAINS (8 territories, center area) ==========
  {
    id: 'p1', name: 'Plaine Dorée', region: 'central_plains', terrainType: 'plains',
    svgPath: 'M 200,130 L 270,130 L 320,100 L 330,120 L 340,180 L 290,220 L 220,210 L 180,180 Z',
    center: { x: 265, y: 170 }, adjacentIds: ['h2', 'h4', 'p2', 'p4', 'k1', 'f3'],
    resourceGeneration: { gold: 2, food: 4, wood: 1 }, owner: 'ironpeak',
  },
  {
    id: 'p2', name: 'Champs de Blé', region: 'central_plains', terrainType: 'plains',
    svgPath: 'M 330,120 L 380,130 L 450,110 L 530,140 L 520,190 L 460,210 L 390,200 L 340,180 Z',
    center: { x: 430, y: 165 }, adjacentIds: ['h4', 'h6', 'p1', 'p3', 'p5', 'k2'],
    resourceGeneration: { gold: 2, food: 4, wood: 1 }, owner: 'ironpeak',
  },
  {
    id: 'p3', name: 'Carrefour des Marchands', region: 'central_plains', terrainType: 'plains',
    svgPath: 'M 530,140 L 590,120 L 660,140 L 670,200 L 620,230 L 540,220 L 520,190 Z',
    center: { x: 590, y: 180 }, adjacentIds: ['h6', 'p2', 'p6', 'c1', 'c2', 'k2'],
    resourceGeneration: { gold: 4, food: 2, wood: 1 }, owner: null,
  },
  {
    id: 'p4', name: 'Pré Fleuri', region: 'central_plains', terrainType: 'plains',
    svgPath: 'M 180,180 L 220,210 L 250,280 L 200,310 L 140,290 L 130,260 L 140,210 Z',
    center: { x: 185, y: 260 }, adjacentIds: ['p1', 'f3', 'f4', 'k1', 'h5'],
    resourceGeneration: { gold: 1, food: 3, wood: 2 }, owner: null,
  },
  {
    id: 'p5', name: 'Collines Vertes', region: 'central_plains', terrainType: 'hills',
    svgPath: 'M 390,200 L 460,210 L 490,270 L 450,320 L 380,310 L 350,260 L 360,220 Z',
    center: { x: 420, y: 265 }, adjacentIds: ['p2', 'k2', 'k3', 'k5', 's1'],
    resourceGeneration: { gold: 2, food: 2, wood: 2 }, owner: null,
  },
  {
    id: 'p6', name: 'Vallée du Commerce', region: 'central_plains', terrainType: 'plains',
    svgPath: 'M 620,230 L 670,200 L 740,220 L 760,280 L 710,310 L 640,290 L 610,260 Z',
    center: { x: 680, y: 255 }, adjacentIds: ['p3', 'c2', 'c3', 'k4'],
    resourceGeneration: { gold: 4, food: 2, wood: 1 }, owner: null,
  },
  {
    id: 'p7', name: 'Terres Fertiles', region: 'central_plains', terrainType: 'plains',
    svgPath: 'M 290,220 L 340,180 L 360,220 L 350,260 L 300,290 L 250,280 L 260,240 Z',
    center: { x: 305, y: 250 }, adjacentIds: ['p1', 'p5', 'k1', 'k3'],
    resourceGeneration: { gold: 2, food: 3, wood: 2 }, owner: null,
  },
  {
    id: 'p8', name: 'Pont Ancien', region: 'central_plains', terrainType: 'plains',
    svgPath: 'M 540,220 L 620,230 L 610,260 L 580,300 L 520,290 L 490,270 L 510,240 Z',
    center: { x: 555, y: 260 }, adjacentIds: ['p3', 'p5', 'p6', 'k4', 'k5'],
    resourceGeneration: { gold: 3, food: 2, wood: 1 }, owner: null,
  },

  // ========== EAST COAST (6 territories, right side) ==========
  {
    id: 'c1', name: 'Port d\'Ambre', region: 'east_coast', terrainType: 'coastal',
    svgPath: 'M 660,140 L 740,110 L 830,100 L 860,150 L 840,200 L 770,210 L 740,220 L 670,200 Z',
    center: { x: 770, y: 160 }, adjacentIds: ['h6', 'p3', 'c2', 'c4'],
    resourceGeneration: { gold: 4, food: 2, wood: 1 }, owner: 'marenis',
  },
  {
    id: 'c2', name: 'Baie des Perles', region: 'east_coast', terrainType: 'coastal',
    svgPath: 'M 740,220 L 770,210 L 840,200 L 870,240 L 850,300 L 790,310 L 760,280 Z',
    center: { x: 805, y: 255 }, adjacentIds: ['c1', 'c3', 'p3', 'p6'],
    resourceGeneration: { gold: 3, food: 3, wood: 0 }, owner: 'marenis',
  },
  {
    id: 'c3', name: 'Falaises Blanches', region: 'east_coast', terrainType: 'hills',
    svgPath: 'M 760,280 L 790,310 L 850,300 L 880,350 L 850,420 L 780,410 L 730,370 L 710,310 Z',
    center: { x: 790, y: 360 }, adjacentIds: ['c2', 'c5', 'p6', 'k4'],
    resourceGeneration: { gold: 2, food: 2, wood: 2 }, owner: null,
  },
  {
    id: 'c4', name: 'Île du Phare', region: 'east_coast', terrainType: 'coastal',
    svgPath: 'M 860,150 L 940,120 L 1000,140 L 1010,200 L 960,230 L 900,220 L 870,240 L 840,200 Z',
    center: { x: 935, y: 180 }, adjacentIds: ['c1', 'c5'],
    resourceGeneration: { gold: 5, food: 1, wood: 0 }, owner: null,
  },
  {
    id: 'c5', name: 'Récifs Noirs', region: 'east_coast', terrainType: 'coastal',
    svgPath: 'M 870,240 L 900,220 L 960,230 L 1010,280 L 990,350 L 930,380 L 880,350 L 850,300 Z',
    center: { x: 935, y: 300 }, adjacentIds: ['c3', 'c4', 'c6'],
    resourceGeneration: { gold: 3, food: 2, wood: 0 }, owner: null,
  },
  {
    id: 'c6', name: 'Cap des Tempêtes', region: 'east_coast', terrainType: 'coastal',
    svgPath: 'M 880,350 L 930,380 L 990,350 L 1020,420 L 980,480 L 910,470 L 860,430 L 850,420 Z',
    center: { x: 935, y: 420 }, adjacentIds: ['c3', 'c5', 's5'],
    resourceGeneration: { gold: 3, food: 2, wood: 1 }, owner: null,
  },

  // ========== WEST FOREST (5 territories, left side) ==========
  {
    id: 'f1', name: 'Orée du Bois', region: 'west_forest', terrainType: 'forest',
    svgPath: 'M 20,250 L 70,280 L 130,260 L 140,290 L 120,340 L 60,350 L 20,310 Z',
    center: { x: 75, y: 300 }, adjacentIds: ['h3', 'h5', 'f2', 'f3'],
    resourceGeneration: { gold: 1, food: 2, wood: 4 }, owner: 'sylvandis',
  },
  {
    id: 'f2', name: 'Bois Profond', region: 'west_forest', terrainType: 'forest',
    svgPath: 'M 20,310 L 60,350 L 120,340 L 110,400 L 70,430 L 20,420 Z',
    center: { x: 60, y: 375 }, adjacentIds: ['h5', 'f1', 'f4', 'f5'],
    resourceGeneration: { gold: 1, food: 1, wood: 5 }, owner: 'sylvandis',
  },
  {
    id: 'f3', name: 'Clairière Sacrée', region: 'west_forest', terrainType: 'forest',
    svgPath: 'M 140,290 L 200,310 L 210,370 L 170,400 L 120,390 L 120,340 Z',
    center: { x: 160, y: 350 }, adjacentIds: ['f1', 'f4', 'p1', 'p4', 'k1'],
    resourceGeneration: { gold: 2, food: 2, wood: 3 }, owner: null,
  },
  {
    id: 'f4', name: 'Refuge des Elfes', region: 'west_forest', terrainType: 'forest',
    svgPath: 'M 120,390 L 170,400 L 180,460 L 130,500 L 70,490 L 70,430 Z',
    center: { x: 120, y: 450 }, adjacentIds: ['f2', 'f3', 'f5', 's2'],
    resourceGeneration: { gold: 1, food: 2, wood: 4 }, owner: null,
  },
  {
    id: 'f5', name: 'Racines Anciennes', region: 'west_forest', terrainType: 'forest',
    svgPath: 'M 20,420 L 70,430 L 70,490 L 80,550 L 40,580 L 20,540 Z',
    center: { x: 50, y: 500 }, adjacentIds: ['f2', 'f4', 's2'],
    resourceGeneration: { gold: 1, food: 1, wood: 4 }, owner: null,
  },

  // ========== SOUTH SWAMP (5 territories, bottom area) ==========
  {
    id: 's1', name: 'Marais Brumeux', region: 'south_swamp', terrainType: 'swamp',
    svgPath: 'M 350,260 L 380,310 L 450,320 L 460,390 L 400,420 L 330,400 L 300,340 L 300,290 Z',
    center: { x: 375, y: 350 }, adjacentIds: ['p5', 'k3', 'k5', 's2', 's3'],
    resourceGeneration: { gold: 2, food: 2, wood: 2 }, owner: 'thornwall',
  },
  {
    id: 's2', name: 'Tourbières Noires', region: 'south_swamp', terrainType: 'swamp',
    svgPath: 'M 130,500 L 180,460 L 250,480 L 280,540 L 230,580 L 160,570 L 120,550 L 80,550 Z',
    center: { x: 180, y: 530 }, adjacentIds: ['f4', 'f5', 's1', 's3', 'k3'],
    resourceGeneration: { gold: 1, food: 2, wood: 2 }, owner: 'thornwall',
  },
  {
    id: 's3', name: 'Étang du Serpent', region: 'south_swamp', terrainType: 'swamp',
    svgPath: 'M 280,540 L 330,400 L 400,420 L 430,480 L 390,550 L 320,570 Z',
    center: { x: 350, y: 500 }, adjacentIds: ['s1', 's2', 's4', 'k3'],
    resourceGeneration: { gold: 2, food: 1, wood: 2 }, owner: null,
  },
  {
    id: 's4', name: 'Ruines Englouties', region: 'south_swamp', terrainType: 'swamp',
    svgPath: 'M 430,480 L 460,390 L 540,400 L 580,460 L 550,530 L 480,550 L 430,540 Z',
    center: { x: 500, y: 475 }, adjacentIds: ['s1', 's3', 's5', 'k5'],
    resourceGeneration: { gold: 3, food: 1, wood: 1 }, owner: null,
  },
  {
    id: 's5', name: 'Bayou Maudit', region: 'south_swamp', terrainType: 'swamp',
    svgPath: 'M 580,460 L 650,420 L 730,440 L 760,500 L 720,560 L 630,560 L 560,540 L 550,530 Z',
    center: { x: 660, y: 500 }, adjacentIds: ['s4', 'c6', 'k4', 'k5'],
    resourceGeneration: { gold: 2, food: 2, wood: 1 }, owner: null,
  },

  // ========== CENTRAL KINGDOM (5 territories, center-bottom) ==========
  {
    id: 'k1', name: 'Citadelle Royale', region: 'central_kingdom', terrainType: 'fortress',
    svgPath: 'M 200,310 L 250,280 L 300,290 L 300,340 L 280,380 L 250,400 L 210,370 Z',
    center: { x: 255, y: 340 }, adjacentIds: ['p1', 'p4', 'p7', 'f3', 'k2', 'k3'],
    resourceGeneration: { gold: 3, food: 2, wood: 1 }, owner: 'valdoria',
  },
  {
    id: 'k2', name: 'Trône de Pierre', region: 'central_kingdom', terrainType: 'fortress',
    svgPath: 'M 460,210 L 520,190 L 540,220 L 520,290 L 490,270 L 450,320 L 420,300 L 390,200 Z',
    center: { x: 475, y: 255 }, adjacentIds: ['p2', 'p3', 'p5', 'p8', 'k1', 'k4', 'k5'],
    resourceGeneration: { gold: 3, food: 2, wood: 1 }, owner: 'valdoria',
  },
  {
    id: 'k3', name: 'Jardin du Roi', region: 'central_kingdom', terrainType: 'plains',
    svgPath: 'M 250,400 L 280,380 L 300,340 L 330,400 L 280,540 L 250,480 L 210,450 L 210,420 Z',
    center: { x: 275, y: 440 }, adjacentIds: ['k1', 'p5', 'p7', 's1', 's2', 's3'],
    resourceGeneration: { gold: 2, food: 4, wood: 1 }, owner: null,
  },
  {
    id: 'k4', name: 'Marché Central', region: 'central_kingdom', terrainType: 'plains',
    svgPath: 'M 610,260 L 640,290 L 710,310 L 730,370 L 690,410 L 650,420 L 580,400 L 560,340 L 580,300 Z',
    center: { x: 645, y: 350 }, adjacentIds: ['p6', 'p8', 'c3', 'k2', 'k5', 's5'],
    resourceGeneration: { gold: 4, food: 2, wood: 1 }, owner: null,
  },
  {
    id: 'k5', name: 'Tour de Garde', region: 'central_kingdom', terrainType: 'hills',
    svgPath: 'M 450,320 L 490,270 L 520,290 L 580,300 L 560,340 L 580,400 L 540,400 L 460,390 Z',
    center: { x: 520, y: 345 }, adjacentIds: ['p5', 'p8', 'k2', 'k4', 's1', 's4', 's5'],
    resourceGeneration: { gold: 2, food: 2, wood: 2 }, owner: null,
  },
];

export function createTerritories(): Record<string, Territory> {
  const territories: Record<string, Territory> = {};
  TERRITORY_DEFS.forEach((def) => {
    territories[def.id] = {
      id: def.id,
      name: def.name,
      region: def.region,
      svgPath: def.svgPath,
      center: def.center,
      adjacentIds: def.adjacentIds,
      owner: def.owner,
      army: { militia: def.owner ? 5 : 2, archer: 0, knight: 0, siege: 0 },
      resourceGeneration: def.resourceGeneration,
      terrainType: def.terrainType,
      defenseBonus: TERRAIN_DEFENSE_BONUS[def.terrainType] ?? 0,
    };
  });
  return territories;
}

export { TERRITORY_DEFS };
