import { memo } from 'react';
import { MAP_WIDTH, MAP_HEIGHT } from '@/constants/gameConfig';

export const MapBorder = memo(function MapBorder() {
  const m = 8; // margin
  return (
    <g style={{ pointerEvents: 'none' }}>
      {/* Outer border */}
      <rect
        x={m}
        y={m}
        width={MAP_WIDTH - m * 2}
        height={MAP_HEIGHT - m * 2}
        fill="none"
        stroke="#8b7355"
        strokeWidth={3}
        rx={4}
      />
      {/* Inner ornamental border */}
      <rect
        x={m + 6}
        y={m + 6}
        width={MAP_WIDTH - m * 2 - 12}
        height={MAP_HEIGHT - m * 2 - 12}
        fill="none"
        stroke="#a0906a"
        strokeWidth={1}
        strokeDasharray="8 4"
        rx={2}
      />
      {/* Corner ornaments */}
      {[
        [m + 4, m + 4],
        [MAP_WIDTH - m - 4, m + 4],
        [m + 4, MAP_HEIGHT - m - 4],
        [MAP_WIDTH - m - 4, MAP_HEIGHT - m - 4],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={5} fill="none" stroke="#8b7355" strokeWidth={1.5} />
          <circle cx={cx} cy={cy} r={2} fill="#8b7355" />
        </g>
      ))}
    </g>
  );
});
