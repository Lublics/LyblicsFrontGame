import { useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { BETRAYAL_PENALTY_TICKS } from '@/constants/gameConfig';
import type { FactionId, Resources } from '@/types';

let diplomacyIdCounter = 0;

export function useDiplomacy() {
  const store = useGameStore;
  const diplomacy = useGameStore((s) => s.diplomacy);
  const factions = useGameStore((s) => s.factions);
  const tick = useGameStore((s) => s.tick);

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
        && (p.formedAtTick + p.duration > tick)
    );
    if (hasPact) return 'non_aggression' as const;

    return 'neutral' as const;
  }, [diplomacy.alliances, diplomacy.pacts, tick]);

  const proposeAlliance = useCallback((from: FactionId, to: FactionId) => {
    const state = store.getState();
    diplomacyIdCounter += 1;
    state.addAlliance({
      id: `alliance-${diplomacyIdCounter}`,
      factionA: from,
      factionB: to,
      formedAtTick: state.tick,
    });
    state.addNotification({
      message: `Alliance formée entre ${factions[from]?.name} et ${factions[to]?.name}!`,
      type: 'diplomacy',
      tick: state.tick,
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
      tick: state.tick,
      type: 'broke_alliance',
    });
    state.addNotification({
      message: `${factions[betrayer]?.name} a trahi l'alliance avec ${factions[victim]?.name}!`,
      type: 'diplomacy',
      tick: state.tick,
    });
  }, [diplomacy.alliances, factions]);

  const proposePact = useCallback((from: FactionId, to: FactionId, duration: number = 120) => {
    const state = store.getState();
    diplomacyIdCounter += 1;
    state.addPact({
      id: `pact-${diplomacyIdCounter}`,
      factionA: from,
      factionB: to,
      formedAtTick: state.tick,
      duration,
    });
    state.addNotification({
      message: `Pacte de non-agression entre ${factions[from]?.name} et ${factions[to]?.name}!`,
      type: 'diplomacy',
      tick: state.tick,
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
      tick: state.tick,
    });
  }, []);

  const acceptTrade = useCallback((tradeId: string) => {
    const state = store.getState();
    const trade = diplomacy.tradeOffers.find((t) => t.id === tradeId);
    if (!trade || trade.status !== 'pending') return;

    // Transfer resources
    const fromFaction = state.factions[trade.from];
    const toFaction = state.factions[trade.to];
    if (!fromFaction || !toFaction) return;

    if (trade.offering.gold) state.updateFactionResources(trade.from, { gold: -(trade.offering.gold) });
    if (trade.offering.food) state.updateFactionResources(trade.from, { food: -(trade.offering.food) });
    if (trade.offering.wood) state.updateFactionResources(trade.from, { wood: -(trade.offering.wood) });

    if (trade.requesting.gold) state.updateFactionResources(trade.to, { gold: -(trade.requesting.gold) });
    if (trade.requesting.food) state.updateFactionResources(trade.to, { food: -(trade.requesting.food) });
    if (trade.requesting.wood) state.updateFactionResources(trade.to, { wood: -(trade.requesting.wood) });

    // Give what was traded
    if (trade.offering.gold) state.updateFactionResources(trade.to, { gold: trade.offering.gold });
    if (trade.offering.food) state.updateFactionResources(trade.to, { food: trade.offering.food });
    if (trade.offering.wood) state.updateFactionResources(trade.to, { wood: trade.offering.wood });

    if (trade.requesting.gold) state.updateFactionResources(trade.from, { gold: trade.requesting.gold });
    if (trade.requesting.food) state.updateFactionResources(trade.from, { food: trade.requesting.food });
    if (trade.requesting.wood) state.updateFactionResources(trade.from, { wood: trade.requesting.wood });

    state.updateTradeOffer(tradeId, 'accepted');
    state.addNotification({
      message: `Échange accepté entre ${fromFaction.name} et ${toFaction.name}!`,
      type: 'diplomacy',
      tick: state.tick,
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
