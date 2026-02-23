import { FactionId, Resources } from './index';

export type DiplomaticStatus = 'neutral' | 'allied' | 'war' | 'non_aggression';

export interface Alliance {
  id: string;
  factionA: FactionId;
  factionB: FactionId;
  formedAtTick: number;
}

export interface TradeOffer {
  id: string;
  from: FactionId;
  to: FactionId;
  offering: Partial<Resources>;
  requesting: Partial<Resources>;
  status: 'pending' | 'accepted' | 'rejected';
  tick: number;
}

export interface NonAggressionPact {
  id: string;
  factionA: FactionId;
  factionB: FactionId;
  formedAtTick: number;
  duration: number; // ticks
}

export interface BetrayalRecord {
  betrayer: FactionId;
  victim: FactionId;
  tick: number;
  type: 'broke_alliance' | 'broke_pact';
}

export interface DiplomacyState {
  alliances: Alliance[];
  tradeOffers: TradeOffer[];
  pacts: NonAggressionPact[];
  betrayals: BetrayalRecord[];
  relations: Record<string, number>; // "factionA-factionB" => -100 to 100
}
