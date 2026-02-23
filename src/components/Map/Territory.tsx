import { memo, useCallback, useState } from 'react';
import type { Territory as TerritoryType } from '@/types';
import { useGameStore } from '@/store/useGameStore';
import { NEUTRAL_COLOR, NEUTRAL_COLOR_LIGHT } from '@/utils/colorUtils';

interface Props {
  territory: TerritoryType;
  isSelected: boolean;
  isAdjacent: boolean;
  isPlayerOwned: boolean;
}

export const TerritoryShape = memo(function TerritoryShape({ territory, isSelected, isAdjacent, isPlayerOwned }: Props) {
  const [hovered, setHovered] = useState(false);
  const factions = useGameStore((s) => s.factions);
  const setSelected = useGameStore((s) => s.setSelectedTerritory);

  const owner = territory.owner ? factions[territory.owner] : null;
  const fillColor = owner ? owner.color : NEUTRAL_COLOR;
  const fillColorLight = owner ? owner.colorLight : NEUTRAL_COLOR_LIGHT;

  const handleClick = useCallback(() => {
    setSelected(territory.id);
  }, [territory.id, setSelected]);

  let strokeColor = '#5a4a30';
  let strokeWidth = 1.5;
  let fillOpacity = 0.7;

  if (isSelected) {
    strokeColor = '#fff';
    strokeWidth = 3;
    fillOpacity = 0.9;
  } else if (isAdjacent) {
    strokeColor = '#ffd700';
    strokeWidth = 2;
    fillOpacity = 0.8;
  }

  if (hovered) {
    fillOpacity = Math.min(1, fillOpacity + 0.15);
  }

  return (
    <g
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Territory fill */}
      <path
        d={territory.svgPath}
        fill={hovered ? fillColorLight : fillColor}
        fillOpacity={fillOpacity}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Inner glow for selected */}
      {isSelected && (
        <path
          d={territory.svgPath}
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth={1}
          strokeLinejoin="round"
          style={{ pointerEvents: 'none' }}
        />
      )}
    </g>
  );
});
