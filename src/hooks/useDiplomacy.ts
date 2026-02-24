import { useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { BETRAYAL_PENALTY_TURNS } from '@/constants/gameConfig';
import type { FactionId, Resources } from '@/types';

let diplomacyIdCounter = 0;

export function useDiplomacy() {
  const store = useGameStore;
  const diplomacy = useGameStore((s) => s.diplomacy);
  const factions = useGameStore((s) => s.factions);
  const turnNumber = useGameStore((s) => s.turnNumber);

  const getRelation = useCallback((a: FactionId, b: FactionId): number => {
    const key = [a, b].sort().join('-');
    return diplomacy.relations[key] ?? 0;
  }, [diplomacy.relations]);

  const getStatus = useCallback((a: FactionId, b: FactionId) => {
    const hasAlliance = diplomacy.alliances.some(
      (al) => (al.factionA === a && al.factionB === b) || (al.factionA === b && al.factionB === a)
    );
    if (hasAlliance) return 'allied' as const;

    const hasPact = diplomacy.pacts.some(
      (p) => ((p.factionA === a && p.factionB === b) || (p.factionA === b && p.factionB === a))
        && (p.formedAtTurn + p.duration > turnNumber)
    );
    if (hasPact) return 'non_aggression' as const;

    return 'neutral' as const;
  }, [diplomacy.alliances, diplomacy.pacts, turnNumber]);

  const proposeAlliance = useCallback((from: FactionId, to: FactionId) => {
    const state = store.getState();
    diplomacyIdCounter += 1;
    state.addAlliance({
      id: `alliance-${diplomacyIdCounter}`,
      factionA: from,
      factionB: to,
      formedAtTurn: state.turnNumber,
    });
    state.addNotification({
      message: `Alliance formée entre ${factions[from]?.name} et ${factions[to]?.name}!`,
      type: 'diplomacy',
      turn: state.turnNumber,
    });
  }, [factions]);

  const breakAlliance = useCallback((allianceId: string, betrayer: FactionId) => {
    const state = store.getState();
    const alliance = diplomacy.alliances.find((a) => a.id === allianceId);
    if (!alliance) return;

    const victim = alliance.factionA === betrayer ? alliance.factionB : alliance.factionA;
    state.removeAlliance(allianceId);
    state.recordBetrayal({
      betrayer,
      victim,
      turn: state.turnNumber,
      type: 'broke_alliance',
    });
    state.addNotification({
      message: `${factions[betrayer]?.name} a trahi l'alliance avec ${factions[victim]?.name}!`,
      type: 'diplomacy',
      turn: state.turnNumber,
    });
  }, [diplomacy.alliances, factions]);

  const proposePact = useCallback((from: FactionId, to: FactionId, duration: number = 15) => {
    const state = store.getState();
    diplomacyIdCounter += 1;
    state.addPact({
      id: `pact-${diplomacyIdCounter}`,
      factionA: from,
      factionB: to,
      formedAtTurn: state.turnNumber,
      duration,
    });
    state.addNotification({
      message: `Pacte de non-agression entre ${factions[from]?.name} et ${factions[to]?.name}!`,
      type: 'diplomacy',
      turn: state.turnNumber,
    });
  }, [factions]);

  const proposeTrade = useCallback((from: FactionId, to: FactionId, offering: Partial<Resources>, requesting: Partial<Resources>) => {
    const state = store.getState();
    diplomacyIdCounter += 1;
    state.addTradeOffer({
      id: `trade-${diplomacyIdCounter}`,
      from,
      to,
      offering,
      requesting,
      status: 'pending',
      turn: state.turnNumber,
    });
  }, []);

  const acceptTrade = useCallback((tradeId: string) => {
    const state = store.getState();
    const trade = diplomacy.tradeOffers.find((t) => t.id === tradeId);
    if (!trade || trade.status !== 'pending') return;

    const fromFaction = state.factions[trade.from];
    const toFaction = state.factions[trade.to];
    if (!fromFaction || !toFaction) return;

    // Validate that both factions have sufficient resources
    const offeringGold = trade.offering.gold ?? 0;
    const offeringFood = trade.offering.food ?? 0;
    const offeringWood = trade.offering.wood ?? 0;
    const requestingGold = trade.requesting.gold ?? 0;
    const requestingFood = trade.requesting.food ?? 0;
    const requestingWood = trade.requesting.wood ?? 0;

    if (fromFaction.resources.gold < offeringGold ||
        fromFaction.resources.food < offeringFood ||
        fromFaction.resources.wood < offeringWood) {
      state.addNotification({
        message: `${fromFaction.name} n'a pas assez de ressources pour cet échange!`,
        type: 'diplomacy',
        turn: state.turnNumber,
      });
      state.updateTradeOffer(tradeId, 'rejected');
      return;
    }

    if (toFaction.resources.gold < requestingGold ||
        toFaction.resources.food < requestingFood ||
        toFaction.resources.wood < requestingWood) {
      state.addNotification({
        message: `${toFaction.name} n'a pas assez de ressources pour cet échange!`,
        type: 'diplomacy',
        turn: state.turnNumber,
      });
      state.updateTradeOffer(tradeId, 'rejected');
      return;
    }

    // Deduct from sender, add to receiver
    if (offeringGold) state.updateFactionResources(trade.from, { gold: -offeringGold });
    if (offeringFood) state.updateFactionResources(trade.from, { food: -offeringFood });
    if (offeringWood) state.updateFactionResources(trade.from, { wood: -offeringWood });

    if (offeringGold) state.updateFactionResources(trade.to, { gold: offeringGold });
    if (offeringFood) state.updateFactionResources(trade.to, { food: offeringFood });
    if (offeringWood) state.updateFactionResources(trade.to, { wood: offeringWood });

    // Deduct from receiver, add to sender
    if (requestingGold) state.updateFactionResources(trade.to, { gold: -requestingGold });
    if (requestingFood) state.updateFactionResources(trade.to, { food: -requestingFood });
    if (requestingWood) state.updateFactionResources(trade.to, { wood: -requestingWood });

    if (requestingGold) state.updateFactionResources(trade.from, { gold: requestingGold });
    if (requestingFood) state.updateFactionResources(trade.from, { food: requestingFood });
    if (requestingWood) state.updateFactionResources(trade.from, { wood: requestingWood });

    state.updateTradeOffer(tradeId, 'accepted');
    state.addNotification({
      message: `Échange accepté entre ${fromFaction.name} et ${toFaction.name}!`,
      type: 'diplomacy',
      turn: state.turnNumber,
    });
  }, [diplomacy.tradeOffers]);

  return {
    diplomacy,
    getRelation,
    getStatus,
    proposeAlliance,
    breakAlliance,
    proposePact,
    proposeTrade,
    acceptTrade,
  };
}
