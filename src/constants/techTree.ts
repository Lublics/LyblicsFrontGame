import type { TechNode } from '@/types/tech';

export const TECH_TREE: TechNode[] = [
  // ========== MILITARY BRANCH ==========
  {
    id: 'archery', name: 'Archerie', category: 'military', tier: 1, cost: 50,
    description: 'Débloque les archers, unités à distance.',
    prerequisites: [],
    effects: [{ type: 'unlock_unit', target: 'archer', value: 1 }],
    position: { x: 0, y: 0 },
  },
  {
    id: 'longbows', name: 'Arcs Longs', category: 'military', tier: 2, cost: 100,
    description: '+10% attaque pour toutes les unités.',
    prerequisites: ['archery'],
    effects: [{ type: 'attack_bonus', value: 0.1 }],
    position: { x: 0, y: 1 },
  },
  {
    id: 'horsemanship', name: 'Équitation', category: 'military', tier: 1, cost: 60,
    description: 'Débloque les chevaliers, unités de cavalerie lourde.',
    prerequisites: [],
    effects: [{ type: 'unlock_unit', target: 'knight', value: 1 }],
    position: { x: 1, y: 0 },
  },
  {
    id: 'heavy_cavalry', name: 'Cavalerie Lourde', category: 'military', tier: 2, cost: 120,
    description: '+15% attaque pour toutes les unités.',
    prerequisites: ['horsemanship'],
    effects: [{ type: 'attack_bonus', value: 0.15 }],
    position: { x: 1, y: 1 },
  },
  {
    id: 'siege_warfare', name: 'Guerre de Siège', category: 'military', tier: 2, cost: 100,
    description: 'Débloque les engins de siège.',
    prerequisites: ['archery'],
    effects: [{ type: 'unlock_unit', target: 'siege', value: 1 }],
    position: { x: 0, y: 2 },
  },
  {
    id: 'trebuchets', name: 'Trébuchets', category: 'military', tier: 3, cost: 180,
    description: '+20% attaque pour toutes les unités.',
    prerequisites: ['siege_warfare'],
    effects: [{ type: 'attack_bonus', value: 0.2 }],
    position: { x: 0, y: 3 },
  },
  {
    id: 'fortification', name: 'Fortification', category: 'military', tier: 2, cost: 100,
    description: '+20% défense pour tous les territoires.',
    prerequisites: ['horsemanship'],
    effects: [{ type: 'defense_bonus', value: 0.2 }],
    position: { x: 1, y: 2 },
  },

  // ========== ECONOMY BRANCH ==========
  {
    id: 'agriculture', name: 'Agriculture', category: 'economy', tier: 1, cost: 40,
    description: '+25% production de nourriture.',
    prerequisites: [],
    effects: [{ type: 'resource_bonus', target: 'food', value: 0.25 }],
    position: { x: 3, y: 0 },
  },
  {
    id: 'irrigation', name: 'Irrigation', category: 'economy', tier: 2, cost: 80,
    description: '+25% supplémentaire de nourriture.',
    prerequisites: ['agriculture'],
    effects: [{ type: 'resource_bonus', target: 'food', value: 0.25 }],
    position: { x: 3, y: 1 },
  },
  {
    id: 'mining', name: 'Exploitation Minière', category: 'economy', tier: 1, cost: 50,
    description: '+25% production d\'or.',
    prerequisites: [],
    effects: [{ type: 'resource_bonus', target: 'gold', value: 0.25 }],
    position: { x: 4, y: 0 },
  },
  {
    id: 'deep_mining', name: 'Mines Profondes', category: 'economy', tier: 2, cost: 100,
    description: '+25% supplémentaire d\'or.',
    prerequisites: ['mining'],
    effects: [{ type: 'resource_bonus', target: 'gold', value: 0.25 }],
    position: { x: 4, y: 1 },
  },
  {
    id: 'forestry', name: 'Sylviculture', category: 'economy', tier: 1, cost: 40,
    description: '+25% production de bois.',
    prerequisites: [],
    effects: [{ type: 'resource_bonus', target: 'wood', value: 0.25 }],
    position: { x: 5, y: 0 },
  },
  {
    id: 'sawmills', name: 'Scieries', category: 'economy', tier: 2, cost: 80,
    description: '+25% supplémentaire de bois.',
    prerequisites: ['forestry'],
    effects: [{ type: 'resource_bonus', target: 'wood', value: 0.25 }],
    position: { x: 5, y: 1 },
  },
  {
    id: 'taxation', name: 'Taxation', category: 'economy', tier: 2, cost: 90,
    description: '+15% de tous les revenus en or.',
    prerequisites: ['mining'],
    effects: [{ type: 'resource_bonus', target: 'gold', value: 0.15 }],
    position: { x: 4, y: 2 },
  },

  // ========== DIPLOMACY BRANCH ==========
  {
    id: 'diplomacy_basics', name: 'Bases Diplomatiques', category: 'diplomacy', tier: 1, cost: 40,
    description: 'Permet les pactes de non-agression.',
    prerequisites: [],
    effects: [{ type: 'diplomacy_bonus', value: 0.1 }],
    position: { x: 7, y: 0 },
  },
  {
    id: 'trade_routes', name: 'Routes Commerciales', category: 'diplomacy', tier: 2, cost: 80,
    description: 'Permet le commerce entre factions.',
    prerequisites: ['diplomacy_basics'],
    effects: [{ type: 'trade_bonus', value: 0.2 }],
    position: { x: 7, y: 1 },
  },
  {
    id: 'espionage', name: 'Espionnage', category: 'diplomacy', tier: 3, cost: 140,
    description: 'Voir les ressources et armées ennemies.',
    prerequisites: ['trade_routes'],
    effects: [{ type: 'espionage', value: 1 }],
    position: { x: 7, y: 2 },
  },
  {
    id: 'master_diplomacy', name: 'Maîtrise Diplomatique', category: 'diplomacy', tier: 4, cost: 200,
    description: 'Réduit la pénalité de trahison de 50%.',
    prerequisites: ['espionage'],
    effects: [{ type: 'diplomacy_bonus', value: 0.5 }],
    position: { x: 7, y: 3 },
  },
];
