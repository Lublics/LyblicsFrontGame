import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { TECH_TREE } from '@/constants/techTree';
import { AP_COST } from '@/constants/gameConfig';
import { spendAP } from '@/engine/actionPoints';
import type { TechNode } from '@/types/tech';
import '@/styles/parchment.css';

const CATEGORY_COLORS = {
  military: '#8b2500',
  economy: '#2e5e1a',
  diplomacy: '#4a7c9b',
};

const CATEGORY_LABELS = {
  military: 'Militaire',
  economy: 'Économie',
  diplomacy: 'Diplomatie',
};

export function TechPanel() {
  const activeFactionId = useGameStore((s) => s.activeFactionId);
  const faction = useGameStore((s) => activeFactionId ? s.factions[activeFactionId] : null);
  const actionPoints = useGameStore((s) => s.actionPoints);
  const phase = useGameStore((s) => s.phase);
  const [activeCategory, setActiveCategory] = useState<'military' | 'economy' | 'diplomacy'>('military');

  const isPlayerTurn = phase === 'player_turn';

  if (!faction) return null;

  const techs = TECH_TREE.filter((t) => t.category === activeCategory);
  const researched = new Set(faction.techResearched);

  const canResearch = (tech: TechNode): boolean => {
    if (researched.has(tech.id)) return false;
    if (faction.currentResearch) return false;
    return tech.prerequisites.every((p) => researched.has(p));
  };

  const handleStartResearch = (tech: TechNode) => {
    if (!activeFactionId || !isPlayerTurn || !canResearch(tech)) return;
    if (!spendAP(AP_COST.research)) return;
    useGameStore.getState().startResearch(activeFactionId, tech.id);
  };

  return (
    <div className="parchment-panel" style={{ width: 280, padding: 12, overflowY: 'auto' }}>
      <div className="parchment-heading" style={{ fontSize: '0.85rem', marginBottom: 8 }}>
        Recherche
      </div>

      {/* Current research */}
      {faction.currentResearch && (
        <div style={{
          padding: '6px 8px',
          background: 'rgba(196, 165, 53, 0.15)',
          border: '1px solid rgba(196, 165, 53, 0.3)',
          borderRadius: 3,
          marginBottom: 8,
          fontSize: '0.75rem',
        }}>
          <div style={{ fontWeight: 600 }}>En cours: {TECH_TREE.find((t) => t.id === faction.currentResearch)?.name}</div>
          <div className="parchment-progress" style={{ marginTop: 4 }}>
            <div
              className="parchment-progress-fill"
              style={{
                width: `${Math.min(100, (faction.researchProgress / (TECH_TREE.find((t) => t.id === faction.currentResearch)?.cost ?? 1)) * 100)}%`,
                background: '#c4a535',
              }}
            />
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {(['military', 'economy', 'diplomacy'] as const).map((cat) => (
          <button
            key={cat}
            className="parchment-btn"
            style={{
              flex: 1,
              padding: '3px 6px',
              fontSize: '0.65rem',
              background: activeCategory === cat ? CATEGORY_COLORS[cat] : undefined,
              color: activeCategory === cat ? '#fff' : undefined,
            }}
            onClick={() => setActiveCategory(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Tech list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {techs.map((tech) => {
          const isResearched = researched.has(tech.id);
          const canStart = canResearch(tech);
          const prereqMet = tech.prerequisites.every((p) => researched.has(p));
          const canClick = canStart && isPlayerTurn && actionPoints >= AP_COST.research;

          return (
            <div
              key={tech.id}
              style={{
                padding: '6px 8px',
                background: isResearched ? 'rgba(46, 94, 26, 0.1)' : 'rgba(255,255,255,0.2)',
                border: `1px solid ${isResearched ? '#2e5e1a' : prereqMet ? CATEGORY_COLORS[activeCategory] : 'rgba(139,115,85,0.3)'}`,
                borderRadius: 3,
                opacity: prereqMet || isResearched ? 1 : 0.5,
                cursor: canClick ? 'pointer' : 'default',
              }}
              onClick={() => canClick && handleStartResearch(tech)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                  {isResearched ? '✅ ' : ''}{tech.name}
                </div>
                <span style={{ fontSize: '0.65rem', color: '#6b5840' }}>
                  T{tech.tier} • {tech.cost}pts
                </span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#6b5840', marginTop: 2 }}>
                {tech.description}
              </div>
              {!isResearched && canStart && (
                <div style={{
                  fontSize: '0.6rem',
                  color: canClick ? CATEGORY_COLORS[activeCategory] : '#999',
                  marginTop: 2,
                  fontWeight: 600,
                }}>
                  ► Cliquer pour rechercher ({AP_COST.research} PA)
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
