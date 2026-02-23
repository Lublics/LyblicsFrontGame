import { useGameStore } from '@/store/useGameStore';

export function useSelectedTerritory() {
  const selectedId = useGameStore((s) => s.selectedTerritoryId);
  const territory = useGameStore((s) => selectedId ? s.territories[selectedId] : null);
  const setSelected = useGameStore((s) => s.setSelectedTerritory);
  return { selectedId, territory, setSelected };
}
