export type TechCategory = 'military' | 'economy' | 'diplomacy';

export interface TechEffect {
  type:
    | 'unlock_unit'
    | 'attack_bonus'
    | 'defense_bonus'
    | 'resource_bonus'
    | 'diplomacy_bonus'
    | 'training_speed'
    | 'trade_bonus'
    | 'espionage';
  target?: string;
  value: number;
}

export interface TechNode {
  id: string;
  name: string;
  description: string;
  category: TechCategory;
  cost: number; // research points (derived from gold)
  prerequisites: string[];
  effects: TechEffect[];
  tier: number; // 1-4
  position: { x: number; y: number }; // for visual layout
}
