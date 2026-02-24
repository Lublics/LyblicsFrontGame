import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useDiplomacy } from '@/hooks/useDiplomacy';
import { AP_COST } from '@/constants/gameConfig';
import { spendAP } from '@/engine/actionPoints';
import type { FactionId } from '@/types';
import '@/styles/parchment.css';

export function DiplomacyPanel() {
  const activeFactionId = useGameStore((s) => s.activeFactionId);
  const factions = useGameStore((s) => s.factions);
  const faction = activeFactionId ? factions[activeFactionId] : null;
  const actionPoints = useGameStore((s) => s.actionPoints);
  const phase = useGameStore((s) => s.phase);
  const { diplomacy, getStatus, getRelation, proposeAlliance, breakAlliance, proposePact } = useDiplomacy();

  const isPlayerTurn = phase === 'player_turn';

  if (!faction || !activeFactionId) return null;

  const otherFactions = Object.values(factions).filter((f) => f.alive && f.id !== activeFactionId);

  const handleDiplomacyAction = (action: () => void) => {
    if (!isPlayerTurn) return;
    if (!spendAP(AP_COST.diplomacy)) return;
    action();
  };

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
          ⚠ Pénalité de trahison: {faction.diplomaticPenalty} tours restants
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
                      disabled={!isPlayerTurn || actionPoints < AP_COST.diplomacy}
                      onClick={() => handleDiplomacyAction(() => proposeAlliance(activeFactionId, other.id))}
                    >
                      Alliance ({AP_COST.diplomacy})
                    </button>
                    <button
                      className="parchment-btn"
                      style={{ padding: '2px 6px', fontSize: '0.6rem', flex: 1 }}
                      disabled={!isPlayerTurn || actionPoints < AP_COST.diplomacy}
                      onClick={() => handleDiplomacyAction(() => proposePact(activeFactionId, other.id))}
                    >
                      Pacte ({AP_COST.diplomacy})
                    </button>
                  </>
                )}
                {status === 'allied' && (
                  <button
                    className="parchment-btn parchment-btn-danger"
                    style={{ padding: '2px 6px', fontSize: '0.6rem', flex: 1 }}
                    disabled={!isPlayerTurn || actionPoints < AP_COST.diplomacy}
                    onClick={() => handleDiplomacyAction(() => {
                      const alliance = diplomacy.alliances.find(
                        (a) => (a.factionA === activeFactionId && a.factionB === other.id) ||
                               (a.factionA === other.id && a.factionB === activeFactionId)
                      );
                      if (alliance) breakAlliance(alliance.id, activeFactionId);
                    })}
                  >
                    Trahir ({AP_COST.diplomacy})
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
