import { useCallback, useRef, useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { MAP_WIDTH, MAP_HEIGHT } from '@/constants/gameConfig';
import { TerritoryShape } from './Territory';
import { TerritoryLabel } from './TerritoryLabel';
import { AttackArrow } from './AttackArrow';
import { MapBorder } from './MapBorder';

export function GameMap() {
  const territories = useGameStore((s) => s.territories);
  const factions = useGameStore((s) => s.factions);
  const selectedId = useGameStore((s) => s.selectedTerritoryId);
  const activeFactionId = useGameStore((s) => s.activeFactionId);
  const pendingAttacks = useGameStore((s) => s.pendingAttacks);

  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: MAP_WIDTH, h: MAP_HEIGHT });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const selectedTerritory = selectedId ? territories[selectedId] : null;
  const adjacentIds = selectedTerritory ? new Set(selectedTerritory.adjacentIds) : new Set<string>();

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;

    setViewBox((prev) => {
      const newW = Math.max(300, Math.min(MAP_WIDTH * 1.5, prev.w * zoomFactor));
      const newH = Math.max(200, Math.min(MAP_HEIGHT * 1.5, prev.h * zoomFactor));

      // Zoom towards mouse position
      const svg = svgRef.current;
      if (!svg) return { ...prev, w: newW, h: newH };

      const rect = svg.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top) / rect.height;

      const newX = prev.x + (prev.w - newW) * mx;
      const newY = prev.y + (prev.h - newH) * my;

      return { x: newX, y: newY, w: newW, h: newH };
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 2) { // middle or right click
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const dx = ((e.clientX - panStart.x) / rect.width) * viewBox.w;
    const dy = ((e.clientY - panStart.y) / rect.height) * viewBox.h;

    setViewBox((prev) => ({ ...prev, x: prev.x - dx, y: prev.y - dy }));
    setPanStart({ x: e.clientX, y: e.clientY });
  }, [isPanning, panStart, viewBox.w, viewBox.h]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const territoryList = Object.values(territories);

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        width="100%"
        height="100%"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
        style={{
          background: 'linear-gradient(135deg, #f4e4c1 0%, #e8d4a8 50%, #dcc898 100%)',
          cursor: isPanning ? 'grabbing' : 'default',
        }}
      >
        {/* SVG Defs */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#c00" opacity="0.8" />
          </marker>
          {/* Parchment texture filter */}
          <filter id="parchment-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" />
          </filter>
        </defs>

        {/* Background texture hint */}
        <rect
          x={-50}
          y={-50}
          width={MAP_WIDTH + 100}
          height={MAP_HEIGHT + 100}
          fill="url(#parchmentBg)"
          opacity={0.3}
        />

        {/* Map border */}
        <MapBorder />

        {/* Territory shapes */}
        {territoryList.map((t) => (
          <TerritoryShape
            key={t.id}
            territory={t}
            isSelected={t.id === selectedId}
            isAdjacent={adjacentIds.has(t.id)}
            isPlayerOwned={t.owner === activeFactionId}
          />
        ))}

        {/* Attack arrows */}
        {pendingAttacks.map((attack) => (
          <AttackArrow key={attack.id} attack={attack} />
        ))}

        {/* Labels on top */}
        {territoryList.map((t) => (
          <TerritoryLabel key={`label-${t.id}`} territory={t} />
        ))}
      </svg>
    </div>
  );
}
