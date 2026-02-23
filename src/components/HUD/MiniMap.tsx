import { useGameStore } from '@/store/useGameStore';
import { MAP_WIDTH, MAP_HEIGHT } from '@/constants/gameConfig';
import { NEUTRAL_COLOR } from '@/utils/colorUtils';

export function MiniMap() {
  const territories = useGameStore((s) => s.territories);
  const factions = useGameStore((s) => s.factions);
  const selectedId = useGameStore((s) => s.selectedTerritoryId);
  const setSelected = useGameStore((s) => s.setSelectedTerritory);

  const scale = 0.18;
  const w = MAP_WIDTH * scale;
  const h = MAP_HEIGHT * scale;

  return (
    <div
      className="parchment-panel"
      style={{
        position: 'absolute',
        bottom: 12,
        left: 12,
        width: w + 8,
        height: h + 8,
        padding: 4,
        zIndex: 15,
      }}
    >
      <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} width={w} height={h}>
        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#e8d4a8" />
        {Object.values(territories).map((t) => {
          const owner = t.owner ? factions[t.owner] : null;
          return (
            <path
              key={t.id}
              d={t.svgPath}
              fill={owner ? owner.color : NEUTRAL_COLOR}
              fillOpacity={0.8}
              stroke={t.id === selectedId ? '#fff' : '#5a4a30'}
              strokeWidth={t.id === selectedId ? 3 : 1}
              onClick={() => setSelected(t.id)}
              style={{ cursor: 'pointer' }}
            />
          );
        })}
      </svg>
    </div>
  );
}
