import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useDiplomacy } from '@/hooks/useDiplomacy';
import type { FactionId } from '@/types';
import '@/styles/parchment.css';

export function DiplomacyPanel() {
  const activeFactionId = useGameStore((s) => s.activeFactionId);
  const factions = useGameStore((s) => s.factions);
  const faction = activeFactionId ? factions[activeFactionId] : null;
  const { diplomacy, getStatus, getRelation, proposeAlliance, breakAlliance, proposePact } = useDiplomacy();
  const [selectedFaction, setSelectedFaction] = useState<FactionId | null>(null);

  if (!faction || !activeFactionId) return null;

  const otherFactions = Object.values(factions).filter((f) => f.alive && f.id !== activeFactionId);

  return (
    <div className="parchment-panel" style={{ width: 280, padding: 12, overflowY: 'auto' }}>
      <div className="parchment-heading" style={{ fontSize: '0.85rem', marginBottom: 8 }}>
        Diplomatie
      </div>

      {faction.diplomaticPenalty > 0 && (
        <div style={{
          padding: '4px 8px',
          background: 'rgba(139, 37, 0, 0.1)',
          border: '1px solid rgba(139, 37, 0, 0.3)',
          borderRadius: 3,
          fontSize: '0.7rem',
          color: '#8b2500',
          marginBottom: 8,
        }}>
          ⚠ Pénalité de trahison: {faction.diplomaticPenalty} ticks restants
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {otherFactions.map((other) => {
          const status = getStatus(activeFactionId, other.id);
          const relation = getRelation(activeFactionId, other.id);

          const statusLabel: Record<string, string> = {
            allied: '🤝 Allié',
            non_aggression: '📜 Pacte',
            neutral: '⚖ Neutre',
          };

          return (
            <div key={other.id} style={{
              padding: '6px 8px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(139,115,85,0.2)',
              borderRadius: 3,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: other.color,
                }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 600, flex: 1 }}>
                  {other.name}
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  padding: '1px 6px',
                  borderRadius: 8,
                  background: status === 'allied' ? 'rgba(46,94,26,0.2)' : status === 'non_aggression' ? 'rgba(196,165,53,0.2)' : 'rgba(139,115,85,0.2)',
                }}>
                  {statusLabel[status]}
                </span>
              </div>

              <div style={{ fontSize: '0.65rem', color: '#6b5840', marginBottom: 4 }}>
                Relations: {relation > 0 ? '+' : ''}{relation} • Territoires: {other.territories.length}
                {other.isHuman && ' • ★ Joueur'}
              </div>

              <div style={{ display: 'flex', gap: 4 }}>
                {status === 'neutral' && (
                  <>
                    <button
                      className="parchment-btn"
                      style={{ padding: '2px 6px', fontSize: '0.6rem', flex: 1 }}
                      onClick={() => proposeAlliance(activeFactionId, other.id)}
                    >
                      Alliance
                    </button>
                    <button
                      className="parchment-btn"
                      style={{ padding: '2px 6px', fontSize: '0.6rem', flex: 1 }}
                      onClick={() => proposePact(activeFactionId, other.id)}
                    >
                      Pacte
                    </button>
                  </>
                )}
                {status === 'allied' && (
                  <button
                    className="parchment-btn parchment-btn-danger"
                    style={{ padding: '2px 6px', fontSize: '0.6rem', flex: 1 }}
                    onClick={() => {
                      const alliance = diplomacy.alliances.find(
                        (a) => (a.factionA === activeFactionId && a.factionB === other.id) ||
                               (a.factionA === other.id && a.factionB === activeFactionId)
                      );
                      if (alliance) breakAlliance(alliance.id, activeFactionId);
                    }}
                  >
                    Trahir l'alliance
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Betrayal history */}
      {diplomacy.betrayals.length > 0 && (
        <>
          <div className="parchment-divider" style={{ marginTop: 8 }} />
          <div style={{ fontSize: '0.7rem', marginTop: 4 }}>
            <strong>Trahisons:</strong>
            {diplomacy.betrayals.slice(-3).map((b, i) => (
              <div key={i} style={{ color: '#8b2500', fontSize: '0.65rem', marginTop: 2 }}>
                {factions[b.betrayer]?.name} a trahi {factions[b.victim]?.name}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
