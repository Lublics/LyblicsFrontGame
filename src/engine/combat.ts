import { Army, CombatResult, TerritoryId } from '@/types';
import { UNIT_STATS, COMBAT_VARIANCE } from '@/constants/gameConfig';
import { useGameStore } from '@/store/useGameStore';

function getArmyStrength(army: Army, isDefending: boolean): number {
  let total = 0;
  (Object.keys(army) as (keyof Army)[]).forEach((unitType) => {
    const count = army[unitType];
    const stats = UNIT_STATS[unitType];
    total += count * (isDefending ? stats.defense : stats.attack);
  });
  return total;
}

function getTotalUnits(army: Army): number {
  return army.militia + army.archer + army.knight + army.siege;
}

function applyVariance(value: number): number {
  const variance = 1 + (Math.random() * 2 - 1) * COMBAT_VARIANCE;
  return value * variance;
}

export function resolveCombat(
  attackingArmy: Army,
  defendingArmy: Army,
  territoryId: TerritoryId,
  defenseBonus: number,
  attackerTechBonuses: { attack: number; defense: number },
  defenderTechBonuses: { attack: number; defense: number },
): CombatResult {
  const attackStrength = applyVariance(
    getArmyStrength(attackingArmy, false) * (1 + attackerTechBonuses.attack)
  );
  const defendStrength = applyVariance(
    getArmyStrength(defendingArmy, true) * (1 + defenseBonus) * (1 + defenderTechBonuses.defense)
  );

  const ratio = attackStrength / Math.max(defendStrength, 0.1);
  const attackerWon = ratio > 1;

  // Calculate losses based on ratio
  const attackerLossRate = attackerWon ? Math.min(0.3, 0.6 / ratio) : Math.min(0.8, 0.5 * ratio + 0.3);
  const defenderLossRate = attackerWon ? Math.min(0.9, 0.4 * ratio) : Math.min(0.4, 0.2 * ratio);

  const attackerLosses: Army = {
    militia: Math.floor(attackingArmy.militia * attackerLossRate),
    archer: Math.floor(attackingArmy.archer * attackerLossRate),
    knight: Math.floor(attackingArmy.knight * attackerLossRate),
    siege: Math.floor(attackingArmy.siege * attackerLossRate),
  };

  const defenderLosses: Army = {
    militia: Math.floor(defendingArmy.militia * defenderLossRate),
    archer: Math.floor(defendingArmy.archer * defenderLossRate),
    knight: Math.floor(defendingArmy.knight * defenderLossRate),
    siege: Math.floor(defendingArmy.siege * defenderLossRate),
  };

  return { attackerLosses, defenderLosses, attackerWon, territoryId };
}

export function getTechCombatBonuses(techResearched: string[]): { attack: number; defense: number } {
  let attack = 0;
  let defense = 0;

  if (techResearched.includes('longbows')) attack += 0.1;
  if (techResearched.includes('heavy_cavalry')) attack += 0.15;
  if (techResearched.includes('trebuchets')) attack += 0.2;
  if (techResearched.includes('fortification')) defense += 0.2;

  return { attack, defense };
}
