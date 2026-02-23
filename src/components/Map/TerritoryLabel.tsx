import { memo } from 'react';
import type { Territory } from '@/types';
import { getTotalUnits } from '@/utils/formatters';

interface Props {
  territory: Territory;
}

export const TerritoryLabel = memo(function TerritoryLabel({ territory }: Props) {
  const units = getTotalUnits(territory.army);

  return (
    <g style={{ pointerEvents: 'none' }}>
      {/* Territory name */}
      <text
        x={territory.center.x}
        y={territory.center.y - 6}
        textAnchor="middle"
        fill="#2a1f14"
        fontSize="8"
        fontFamily="'Cinzel', serif"
        fontWeight="600"
        stroke="rgba(244,228,193,0.8)"
        strokeWidth="2.5"
        paintOrder="stroke"
      >
        {territory.name}
      </text>
      {/* Troop count */}
      <g>
        <circle
          cx={territory.center.x}
          cy={territory.center.y + 10}
          r={units > 9 ? 10 : 8}
          fill="rgba(42,31,20,0.7)"
          stroke="rgba(244,228,193,0.5)"
          strokeWidth="0.5"
        />
        <text
          x={territory.center.x}
          y={territory.center.y + 14}
          textAnchor="middle"
          fill="#f4e4c1"
          fontSize="9"
          fontFamily="'Cinzel', serif"
          fontWeight="700"
        >
          {units}
        </text>
      </g>
    </g>
  );
});
