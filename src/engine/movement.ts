import { useGameStore } from '@/store/useGameStore';
import { resolveCombat, getTechCombatBonuses } from './combat';
import type { Army } from '@/types';

export function processMovement() {
  const state = useGameStore.getState();

  const toRemove: string[] = [];

  state.pendingAttacks.forEach((attack) => {
    // Decrement ticks remaining via store (we read fresh each time)
    const freshState = useGameStore.getState();
    const pendingAttack = freshState.pendingAttacks.find((a) => a.id === attack.id);
    if (!pendingAttack) return;

    // We mutate via a new approach: just handle it all here
    const newTicks = pendingAttack.ticksRemaining - 1;

    if (newTicks <= 0) {
      // Attack arrives!
      const targetTerritory = freshState.territories[pendingAttack.toTerritoryId];
      if (!targetTerritory) {
        toRemove.push(pendingAttack.id);
        return;
      }

      const attackerFaction = freshState.factions[pendingAttack.attackerFactionId];
      const defenderFactionId = targetTerritory.owner;
      const defenderFaction = defenderFactionId ? freshState.factions[defenderFactionId] : null;

      const attackerTechBonuses = attackerFaction
        ? getTechCombatBonuses(attackerFaction.techResearched)
        : { attack: 0, defense: 0 };
      const defenderTechBonuses = defenderFaction
        ? getTechCombatBonuses(defenderFaction.techResearched)
        : { attack: 0, defense: 0 };

      const result = resolveCombat(
        pendingAttack.army,
        targetTerritory.army,
        pendingAttack.toTerritoryId,
        targetTerritory.defenseBonus,
        attackerTechBonuses,
        defenderTechBonuses,
      );

      // Apply defender losses
      const newDefenderArmy: Army = {
        militia: Math.max(0, targetTerritory.army.militia - result.defenderLosses.militia),
        archer: Math.max(0, targetTerritory.army.archer - result.defenderLosses.archer),
        knight: Math.max(0, targetTerritory.army.knight - result.defenderLosses.knight),
        siege: Math.max(0, targetTerritory.army.siege - result.defenderLosses.siege),
      };

      if (result.attackerWon) {
        // Surviving attackers occupy the territory
        const survivingArmy: Army = {
          militia: Math.max(0, pendingAttack.army.militia - result.attackerLosses.militia),
          archer: Math.max(0, pendingAttack.army.archer - result.attackerLosses.archer),
          knight: Math.max(0, pendingAttack.army.knight - result.attackerLosses.knight),
          siege: Math.max(0, pendingAttack.army.siege - result.attackerLosses.siege),
        };

        // Transfer territory ownership
        if (defenderFactionId) {
          freshState.removeTerritoryFromFaction(defenderFactionId, pendingAttack.toTerritoryId);
          // Check if defender eliminated
          const defenderState = useGameStore.getState().factions[defenderFactionId];
          if (defenderState && defenderState.territories.length === 0) {
            freshState.eliminateFaction(defenderFactionId);
            freshState.addNotification({
              message: `${defenderState.name} a été éliminé!`,
              type: 'combat',
              tick: freshState.tick,
            });
          }
        }
        freshState.setTerritoryOwner(pendingAttack.toTerritoryId, pendingAttack.attackerFactionId);
        freshState.addTerritoryToFaction(pendingAttack.attackerFactionId, pendingAttack.toTerritoryId);
        freshState.setTerritoryArmy(pendingAttack.toTerritoryId, survivingArmy);

        freshState.addNotification({
          message: `${attackerFaction?.name ?? 'Attaquant'} a conquis ${targetTerritory.name}!`,
          type: 'combat',
          tick: freshState.tick,
          factionId: pendingAttack.attackerFactionId,
        });
      } else {
        // Attack failed, defenders keep territory with losses
        freshState.setTerritoryArmy(pendingAttack.toTerritoryId, newDefenderArmy);
        freshState.addNotification({
          message: `L'attaque sur ${targetTerritory.name} a échoué!`,
          type: 'combat',
          tick: freshState.tick,
          factionId: pendingAttack.attackerFactionId,
        });
      }

      toRemove.push(pendingAttack.id);
    }
  });

  // Remove completed attacks and decrement others
  if (toRemove.length > 0) {
    toRemove.forEach((id) => useGameStore.getState().removePendingAttack(id));
  }

  // Decrement remaining attacks' ticks (done via immer)
  useGameStore.setState((s) => {
    s.pendingAttacks.forEach((a) => {
      if (!toRemove.includes(a.id)) {
        a.ticksRemaining -= 1;
      }
    });
  });
}
