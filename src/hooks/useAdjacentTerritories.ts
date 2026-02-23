import { useMemo } from 'react';
import { useGameStore } from '@/store/useGameStore';

export function useAdjacentTerritories(territoryId: string | null) {
  const territories = useGameStore((s) => s.territories);

  return useMemo(() => {
    if (!territoryId || !territories[territoryId]) return [];
    return territories[territoryId].adjacentIds
      .map((id) => territories[id])
      .filter(Boolean);
  }, [territoryId, territories]);
}
