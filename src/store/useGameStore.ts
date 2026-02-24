import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
  GameState,
  GamePhase,
  FactionId,
  TerritoryId,
  Territory,
  Faction,
  Army,
  Notification,
  VictoryCondition,
  UnitType,
  TrainingQueueItem,
} from '@/types';
import type { DiplomacyState, Alliance, TradeOffer, NonAggressionPact, BetrayalRecord } from '@/types/diplomacy';
import { STARTING_RESOURCES, STARTING_ARMY, MAX_ACTION_POINTS, BETRAYAL_PENALTY_TURNS } from '@/constants/gameConfig';
import { TECH_TREE } from '@/constants/techTree';

export interface GameStore extends GameState {
  diplomacy: DiplomacyState;

  // Game phase
  setPhase: (phase: GamePhase) => void;

  // Turn management
  incrementTurn: () => void;
  startPlayerTurn: () => void;

  // Territory
  setSelectedTerritory: (id: TerritoryId | null) => void;
  setTerritoryOwner: (id: TerritoryId, owner: FactionId | null) => void;
  setTerritoryArmy: (id: TerritoryId, army: Army) => void;
  addUnitsToTerritory: (id: TerritoryId, unitType: UnitType, count: number) => void;

  // Faction
  setActiveFaction: (id: FactionId | null) => void;
  updateFactionResources: (id: FactionId, delta: Partial<{ gold: number; food: number; wood: number }>) => void;
  addTerritoryToFaction: (factionId: FactionId, territoryId: TerritoryId) => void;
  removeTerritoryFromFaction: (factionId: FactionId, territoryId: TerritoryId) => void;
  eliminateFaction: (id: FactionId) => void;

  // Training
  enqueueTraining: (factionId: FactionId, territoryId: TerritoryId, unitType: UnitType, turns: number) => void;
  advanceTrainingQueues: () => void;

  // Notifications
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  clearOldNotifications: (beforeTurn: number) => void;

  // Victory
  setWinner: (factionId: FactionId, condition: VictoryCondition) => void;

  // Tech
  startResearch: (factionId: FactionId, techId: string) => void;
  completeResearch: (factionId: FactionId, techId: string) => void;
  advanceResearch: (factionId: FactionId, progress: number) => void;

  // Diplomacy
  addAlliance: (alliance: Alliance) => void;
  removeAlliance: (id: string) => void;
  addTradeOffer: (offer: TradeOffer) => void;
  updateTradeOffer: (id: string, status: 'accepted' | 'rejected') => void;
  addPact: (pact: NonAggressionPact) => void;
  removePact: (id: string) => void;
  recordBetrayal: (record: BetrayalRecord) => void;
  setRelation: (factionA: FactionId, factionB: FactionId, value: number) => void;

  // Init
  initGame: (territories: Record<TerritoryId, Territory>, factions: Record<FactionId, Faction>) => void;
  resetGame: () => void;
}

const initialDiplomacy: DiplomacyState = {
  alliances: [],
  tradeOffers: [],
  pacts: [],
  betrayals: [],
  relations: {},
};

let notifCounter = 0;

export const useGameStore = create<GameStore>()(
  immer((set) => ({
    // Initial state
    phase: 'menu' as GamePhase,
    turnNumber: 1,
    territories: {},
    factions: {},
    activeFactionId: null,
    selectedTerritoryId: null,
    notifications: [],
    victoryCondition: 'domination' as VictoryCondition,
    winner: null,
    actionPoints: MAX_ACTION_POINTS,
    maxActionPoints: MAX_ACTION_POINTS,
    currentTurnFactionId: null,
    diplomacy: { ...initialDiplomacy },

    // Game phase
    setPhase: (phase) => set((s) => { s.phase = phase; }),

    // Turn management
    incrementTurn: () => set((s) => { s.turnNumber += 1; }),
    startPlayerTurn: () => set((s) => {
      s.phase = 'player_turn';
      s.currentTurnFactionId = s.activeFactionId;
      s.actionPoints = s.maxActionPoints;
    }),

    // Territory
    setSelectedTerritory: (id) => set((s) => { s.selectedTerritoryId = id; }),
    setTerritoryOwner: (id, owner) => set((s) => {
      if (s.territories[id]) s.territories[id].owner = owner;
    }),
    setTerritoryArmy: (id, army) => set((s) => {
      if (s.territories[id]) s.territories[id].army = { ...army };
    }),
    addUnitsToTerritory: (id, unitType, count) => set((s) => {
      if (s.territories[id]) s.territories[id].army[unitType] += count;
    }),

    // Faction
    setActiveFaction: (id) => set((s) => {
      s.activeFactionId = id;
      s.currentTurnFactionId = id;
    }),
    updateFactionResources: (id, delta) => set((s) => {
      const f = s.factions[id];
      if (!f) return;
      if (delta.gold !== undefined) f.resources.gold += delta.gold;
      if (delta.food !== undefined) f.resources.food += delta.food;
      if (delta.wood !== undefined) f.resources.wood += delta.wood;
    }),
    addTerritoryToFaction: (factionId, territoryId) => set((s) => {
      const f = s.factions[factionId];
      if (f && !f.territories.includes(territoryId)) f.territories.push(territoryId);
    }),
    removeTerritoryFromFaction: (factionId, territoryId) => set((s) => {
      const f = s.factions[factionId];
      if (f) f.territories = f.territories.filter((t) => t !== territoryId);
    }),
    eliminateFaction: (id) => set((s) => {
      if (s.factions[id]) s.factions[id].alive = false;
    }),

    // Training
    enqueueTraining: (factionId, territoryId, unitType, turns) => set((s) => {
      const f = s.factions[factionId];
      if (f) {
        f.trainingQueue.push({ unitType, turnsRemaining: turns, territoryId });
      }
    }),
    advanceTrainingQueues: () => set((s) => {
      Object.values(s.factions).forEach((faction) => {
        const completed: number[] = [];
        faction.trainingQueue.forEach((item, idx) => {
          item.turnsRemaining -= 1;
          if (item.turnsRemaining <= 0) {
            completed.push(idx);
            const territory = s.territories[item.territoryId];
            if (territory && territory.owner === faction.id) {
              territory.army[item.unitType] += 1;
            }
          }
        });
        for (let i = completed.length - 1; i >= 0; i--) {
          faction.trainingQueue.splice(completed[i], 1);
        }
      });
    }),

    // Notifications
    addNotification: (notification) => set((s) => {
      notifCounter += 1;
      s.notifications.push({ ...notification, id: `notif-${notifCounter}` });
    }),
    clearOldNotifications: (beforeTurn) => set((s) => {
      s.notifications = s.notifications.filter((n) => n.turn >= beforeTurn);
      if (s.notifications.length > 50) {
        s.notifications = s.notifications.slice(-50);
      }
    }),

    // Victory
    setWinner: (factionId, condition) => set((s) => {
      s.winner = factionId;
      s.victoryCondition = condition;
      s.phase = 'victory';
    }),

    // Tech
    startResearch: (factionId, techId) => set((s) => {
      const f = s.factions[factionId];
      if (!f || f.currentResearch) return;
      if (f.techResearched.includes(techId)) return;
      const tech = TECH_TREE.find((t) => t.id === techId);
      if (!tech) return;
      if (!tech.prerequisites.every((p) => f.techResearched.includes(p))) return;
      f.currentResearch = techId;
      f.researchProgress = 0;
    }),
    completeResearch: (factionId, techId) => set((s) => {
      const f = s.factions[factionId];
      if (f) {
        f.techResearched.push(techId);
        f.currentResearch = null;
        f.researchProgress = 0;
      }
    }),
    advanceResearch: (factionId, progress) => set((s) => {
      const f = s.factions[factionId];
      if (f) f.researchProgress += progress;
    }),

    // Diplomacy
    addAlliance: (alliance) => set((s) => { s.diplomacy.alliances.push(alliance); }),
    removeAlliance: (id) => set((s) => {
      s.diplomacy.alliances = s.diplomacy.alliances.filter((a) => a.id !== id);
    }),
    addTradeOffer: (offer) => set((s) => { s.diplomacy.tradeOffers.push(offer); }),
    updateTradeOffer: (id, status) => set((s) => {
      const offer = s.diplomacy.tradeOffers.find((o) => o.id === id);
      if (offer) offer.status = status;
    }),
    addPact: (pact) => set((s) => { s.diplomacy.pacts.push(pact); }),
    removePact: (id) => set((s) => {
      s.diplomacy.pacts = s.diplomacy.pacts.filter((p) => p.id !== id);
    }),
    recordBetrayal: (record) => set((s) => {
      s.diplomacy.betrayals.push(record);
      const f = s.factions[record.betrayer];
      if (f) f.diplomaticPenalty = BETRAYAL_PENALTY_TURNS;
    }),
    setRelation: (factionA, factionB, value) => set((s) => {
      const key = [factionA, factionB].sort().join('-');
      s.diplomacy.relations[key] = Math.max(-100, Math.min(100, value));
    }),

    // Init
    initGame: (territories, factions) => set((s) => {
      s.territories = territories;
      s.factions = factions;
      s.turnNumber = 1;
      s.phase = 'player_turn';
      s.notifications = [];
      s.winner = null;
      s.actionPoints = MAX_ACTION_POINTS;
      s.maxActionPoints = MAX_ACTION_POINTS;
      s.currentTurnFactionId = null;
      s.diplomacy = { alliances: [], tradeOffers: [], pacts: [], betrayals: [], relations: {} };
    }),
    resetGame: () => set((s) => {
      s.phase = 'menu';
      s.turnNumber = 1;
      s.territories = {};
      s.factions = {};
      s.activeFactionId = null;
      s.selectedTerritoryId = null;
      s.notifications = [];
      s.winner = null;
      s.actionPoints = MAX_ACTION_POINTS;
      s.maxActionPoints = MAX_ACTION_POINTS;
      s.currentTurnFactionId = null;
      s.diplomacy = { alliances: [], tradeOffers: [], pacts: [], betrayals: [], relations: {} };
    }),
  }))
);
