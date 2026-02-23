import type { Army, UnitType, Resources, TerrainType, Region } from '@/types';

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return Math.floor(n).toString();
}

export function getTotalUnits(army: Army): number {
  return army.militia + army.archer + army.knight + army.siege;
}

export function unitTypeName(type: UnitType): string {
  const names: Record<UnitType, string> = {
    militia: 'Milice',
    archer: 'Archer',
    knight: 'Chevalier',
    siege: 'Siège',
  };
  return names[type];
}

export function unitTypeIcon(type: UnitType): string {
  const icons: Record<UnitType, string> = {
    militia: '\u2694',   // ⚔
    archer: '\uD83C\uDFF9', // 🏹
    knight: '\uD83D\uDC0E', // 🐎
    siege: '\uD83D\uDCA3',  // 💣
  };
  return icons[type];
}

export function terrainName(type: TerrainType): string {
  const names: Record<TerrainType, string> = {
    plains: 'Plaines',
    forest: 'Forêt',
    hills: 'Collines',
    mountains: 'Montagnes',
    swamp: 'Marais',
    coastal: 'Côte',
    fortress: 'Forteresse',
  };
  return names[type];
}

export function regionName(region: Region): string {
  const names: Record<Region, string> = {
    highlands_north: 'Highlands du Nord',
    central_plains: 'Plaines Centrales',
    east_coast: 'Côte Est',
    west_forest: 'Forêt de l\'Ouest',
    south_swamp: 'Marais du Sud',
    central_kingdom: 'Royaume Central',
  };
  return names[region];
}

export function resourceIcon(type: keyof Resources): string {
  const icons: Record<keyof Resources, string> = {
    gold: '\uD83E\uDE99',   // 🪙
    food: '\uD83C\uDF3E',   // 🌾
    wood: '\uD83E\uDEB5',   // 🪵
  };
  return icons[type];
}
