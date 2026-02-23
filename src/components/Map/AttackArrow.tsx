import { memo } from 'react';
import type { PendingAttack } from '@/types';
import { useGameStore } from '@/store/useGameStore';

interface Props {
  attack: PendingAttack;
}

export const AttackArrow = memo(function AttackArrow({ attack }: Props) {
  const territories = useGameStore((s) => s.territories);
  const factions = useGameStore((s) => s.factions);
  const from = territories[attack.fromTerritoryId];
  const to = territories[attack.toTerritoryId];
  const faction = factions[attack.attackerFactionId];

  if (!from || !to) return null;

  const color = faction?.color ?? '#ff0000';

  return (
    <g style={{ pointerEvents: 'none' }}>
      <line
        x1={from.center.x}
        y1={from.center.y}
        x2={to.center.x}
        y2={to.center.y}
        stroke={color}
        strokeWidth={2.5}
        strokeDasharray="6 4"
        opacity={0.8}
        markerEnd="url(#arrowhead)"
        style={{ animation: 'attackArrow 1s linear infinite' }}
      />
    </g>
  );
});
