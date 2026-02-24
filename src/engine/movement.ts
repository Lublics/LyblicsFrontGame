import { useGameStore } from '@/store/useGameStore';
import { resolveCombat, getTechCombatBonuses } from './combat';
import type { Army } from '@/types';

export function processMovement() {
  useGameStore.setState((s) => {
    const toRemove: string[] = [];

    s.pendingAttacks.forEach((attack) => {
      attack.ticksRemaining -= 1;

      if (attack.ticksRemaining <= 0) {
        const targetTerritory = s.territories[attack.toTerritoryId];
        if (!targetTerritory) {
          toRemove.push(attack.id);
          return;
        }

        const attackerFaction = s.factions[attack.attackerFactionId];
        const defenderFactionId = targetTerritory.owner;
        const defenderFaction = defenderFactionId ? s.factions[defenderFactionId] : null;

        const attackerTechBonuses = attackerFaction
          ? getTechCombatBonuses(attackerFaction.techResearched)
          : { attack: 0, defense: 0 };
        const defenderTechBonuses = defenderFaction
          ? getTechCombatBonuses(defenderFaction.techResearched)
          : { attack: 0, defense: 0 };

        const result = resolveCombat(
          attack.army,
          targetTerritory.army,
          attack.toTerritoryId,
          targetTerritory.defenseBonus,
          attackerTechBonuses,
          defenderTechBonuses,
        );

        const newDefenderArmy: Army = {
          militia: Math.max(0, targetTerritory.army.militia - result.defenderLosses.militia),
          archer: Math.max(0, targetTerritory.army.archer - result.defenderLosses.archer),
          knight: Math.max(0, targetTerritory.army.knight - result.defenderLosses.knight),
          siege: Math.max(0, targetTerritory.army.siege - result.defenderLosses.siege),
        };

        if (result.attackerWon) {
          const survivingArmy: Army = {
            militia: Math.max(0, attack.army.militia - result.attackerLosses.militia),
            archer: Math.max(0, attack.army.archer - result.attackerLosses.archer),
            knight: Math.max(0, attack.army.knight - result.attackerLosses.knight),
            siege: Math.max(0, attack.army.siege - result.attackerLosses.siege),
          };

          // Transfer territory ownership
          if (defenderFactionId && s.factions[defenderFactionId]) {
            const defender = s.factions[defenderFactionId];
            defender.territories = defender.territories.filter((t) => t !== attack.toTerritoryId);

            if (defender.territories.length === 0) {
              defender.alive = false;
              s.notifications.push({
                id: `notif-mv-${attack.id}-elim`,
                message: `${defender.name} a été éliminé!`,
                type: 'combat',
                tick: s.tick,
              });
            }
          }

          targetTerritory.owner = attack.attackerFactionId;
          targetTerritory.army = survivingArmy;

          if (attackerFaction && !attackerFaction.territories.includes(attack.toTerritoryId)) {
            attackerFaction.territories.push(attack.toTerritoryId);
          }

          s.notifications.push({
            id: `notif-mv-${attack.id}-win`,
            message: `${attackerFaction?.name ?? 'Attaquant'} a conquis ${targetTerritory.name}!`,
            type: 'combat',
            tick: s.tick,
            factionId: attack.attackerFactionId,
          });
        } else {
          targetTerritory.army = newDefenderArmy;
          s.notifications.push({
            id: `notif-mv-${attack.id}-lose`,
            message: `L'attaque sur ${targetTerritory.name} a échoué!`,
            type: 'combat',
            tick: s.tick,
            factionId: attack.attackerFactionId,
          });
        }

        toRemove.push(attack.id);
      }
    });

    // Remove completed attacks
    if (toRemove.length > 0) {
      s.pendingAttacks = s.pendingAttacks.filter((a) => !toRemove.includes(a.id));
    }
  });
}
