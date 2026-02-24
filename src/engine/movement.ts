import { useGameStore } from '@/store/useGameStore';
import { resolveCombat, getTechCombatBonuses } from './combat';
import type { Army, FactionId, TerritoryId } from '@/types';

export function resolveInstantAttack(
  attackerFactionId: FactionId,
  fromTerritoryId: TerritoryId,
  toTerritoryId: TerritoryId,
  sendRatio: number
): { success: boolean; message: string } {
  const state = useGameStore.getState();
  const fromTerritory = state.territories[fromTerritoryId];
  const toTerritory = state.territories[toTerritoryId];

  if (!fromTerritory || !toTerritory) return { success: false, message: 'Territoire invalide' };

  const army: Army = {
    militia: Math.floor(fromTerritory.army.militia * sendRatio),
    archer: Math.floor(fromTerritory.army.archer * sendRatio),
    knight: Math.floor(fromTerritory.army.knight * sendRatio),
    siege: Math.floor(fromTerritory.army.siege * sendRatio),
  };

  const totalUnits = army.militia + army.archer + army.knight + army.siege;
  if (totalUnits < 1) return { success: false, message: 'Pas assez de troupes' };

  // Remove troops from source
  state.setTerritoryArmy(fromTerritoryId, {
    militia: fromTerritory.army.militia - army.militia,
    archer: fromTerritory.army.archer - army.archer,
    knight: fromTerritory.army.knight - army.knight,
    siege: fromTerritory.army.siege - army.siege,
  });

  // Get combat bonuses
  const attackerFaction = state.factions[attackerFactionId];
  const defenderFactionId = toTerritory.owner;
  const defenderFaction = defenderFactionId ? state.factions[defenderFactionId] : null;

  const attackerTechBonuses = attackerFaction
    ? getTechCombatBonuses(attackerFaction.techResearched)
    : { attack: 0, defense: 0 };
  const defenderTechBonuses = defenderFaction
    ? getTechCombatBonuses(defenderFaction.techResearched)
    : { attack: 0, defense: 0 };

  const result = resolveCombat(
    army,
    toTerritory.army,
    toTerritoryId,
    toTerritory.defenseBonus,
    attackerTechBonuses,
    defenderTechBonuses,
  );

  // Apply results atomically
  useGameStore.setState((s) => {
    const target = s.territories[toTerritoryId];
    if (!target) return;

    if (result.attackerWon) {
      const survivingArmy: Army = {
        militia: Math.max(0, army.militia - result.attackerLosses.militia),
        archer: Math.max(0, army.archer - result.attackerLosses.archer),
        knight: Math.max(0, army.knight - result.attackerLosses.knight),
        siege: Math.max(0, army.siege - result.attackerLosses.siege),
      };

      if (defenderFactionId && s.factions[defenderFactionId]) {
        const defender = s.factions[defenderFactionId];
        defender.territories = defender.territories.filter((t) => t !== toTerritoryId);
        if (defender.territories.length === 0) {
          defender.alive = false;
          s.notifications.push({
            id: `notif-elim-${defenderFactionId}-${s.turnNumber}`,
            message: `${defender.name} a été éliminé!`,
            type: 'combat',
            turn: s.turnNumber,
          });
        }
      }

      target.owner = attackerFactionId;
      target.army = survivingArmy;

      if (s.factions[attackerFactionId] && !s.factions[attackerFactionId].territories.includes(toTerritoryId)) {
        s.factions[attackerFactionId].territories.push(toTerritoryId);
      }
    } else {
      target.army = {
        militia: Math.max(0, target.army.militia - result.defenderLosses.militia),
        archer: Math.max(0, target.army.archer - result.defenderLosses.archer),
        knight: Math.max(0, target.army.knight - result.defenderLosses.knight),
        siege: Math.max(0, target.army.siege - result.defenderLosses.siege),
      };
    }
  });

  const attackerName = attackerFaction?.name ?? 'Attaquant';
  return {
    success: result.attackerWon,
    message: result.attackerWon
      ? `${attackerName} a conquis ${toTerritory.name}!`
      : `L'attaque sur ${toTerritory.name} a échoué!`,
  };
}
