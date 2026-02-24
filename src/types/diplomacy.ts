import { FactionId, Resources } from './index';

export type DiplomaticStatus = 'neutral' | 'allied' | 'war' | 'non_aggression';

export interface Alliance {
  id: string;
  factionA: FactionId;
  factionB: FactionId;
  formedAtTurn: number;
}

export interface TradeOffer {
  id: string;
  from: FactionId;
  to: FactionId;
  offering: Partial<Resources>;
  requesting: Partial<Resources>;
  status: 'pending' | 'accepted' | 'rejected';
  turn: number;
}

export interface NonAggressionPact {
  id: string;
  factionA: FactionId;
  factionB: FactionId;
  formedAtTurn: number;
  duration: number; // turns
}

export interface BetrayalRecord {
  betrayer: FactionId;
  victim: FactionId;
  turn: number;
  type: 'broke_alliance' | 'broke_pact';
}

export interface DiplomacyState {
  alliances: Alliance[];
  tradeOffers: TradeOffer[];
  pacts: NonAggressionPact[];
  betrayals: BetrayalRecord[];
  relations: Record<string, number>; // "factionA-factionB" => -100 to 100
}
