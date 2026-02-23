import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { FACTION_TEMPLATES } from '@/constants/factions';
import { initializeGame } from '@/utils/gameInit';
import '@/styles/parchment.css';
import '@/styles/animations.css';

export function SetupScreen() {
  const setPhase = useGameStore((s) => s.setPhase);
  const [humanFaction, setHumanFaction] = useState('nordheim');
  const [enabledFactions, setEnabledFactions] = useState<string[]>(
    FACTION_TEMPLATES.map((f) => f.id)
  );
  const [numPlayers, setNumPlayers] = useState(1);

  const toggleFaction = (id: string) => {
    if (id === humanFaction) return; // Can't disable your own faction
    setEnabledFactions((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleStart = () => {
    const humanFactionIds = numPlayers === 1
      ? [humanFaction]
      : enabledFactions.filter((_, i) => i < numPlayers);

    initializeGame({
      humanFactionIds,
      enabledFactionIds: enabledFactions,
    });
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #f4e4c1 0%, #e8d4a8 100%)',
      gap: 16,
    }}>
      <h2 className="parchment-title" style={{ fontSize: '2rem', letterSpacing: '2px' }}>
        Configuration
      </h2>

      <div style={{ width: 200, height: 1, background: 'linear-gradient(90deg, transparent, #8b7355, transparent)' }} />

      {/* Number of players */}
      <div className="parchment-panel animate-fade-in-up" style={{ padding: 16, width: 500 }}>
        <div className="parchment-heading" style={{ fontSize: '0.85rem', marginBottom: 8 }}>
          Mode de jeu
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              className={`parchment-btn ${numPlayers === n ? 'parchment-btn-primary' : ''}`}
              style={{ flex: 1, padding: '8px' }}
              onClick={() => setNumPlayers(n)}
            >
              {n === 1 ? 'Solo' : `${n} Joueurs`}
            </button>
          ))}
        </div>
      </div>

      {/* Faction selection */}
      <div className="parchment-panel animate-fade-in-up" style={{ padding: 16, width: 500 }}>
        <div className="parchment-heading" style={{ fontSize: '0.85rem', marginBottom: 8 }}>
          {numPlayers === 1 ? 'Choisissez votre faction' : 'Factions actives'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {FACTION_TEMPLATES.map((template) => {
            const isEnabled = enabledFactions.includes(template.id);
            const isHuman = template.id === humanFaction;

            return (
              <div
                key={template.id}
                style={{
                  padding: '8px 10px',
                  background: isHuman
                    ? 'rgba(196, 165, 53, 0.2)'
                    : isEnabled
                    ? 'rgba(255,255,255,0.3)'
                    : 'rgba(0,0,0,0.05)',
                  border: `2px solid ${isHuman ? '#c4a535' : isEnabled ? template.color : '#ccc'}`,
                  borderRadius: 4,
                  cursor: 'pointer',
                  opacity: isEnabled ? 1 : 0.5,
                  transition: 'all 0.15s ease',
                }}
                onClick={() => {
                  if (numPlayers === 1) {
                    setHumanFaction(template.id);
                    if (!enabledFactions.includes(template.id)) {
                      setEnabledFactions([...enabledFactions, template.id]);
                    }
                  } else {
                    toggleFaction(template.id);
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    width: 12, height: 12, borderRadius: '50%',
                    background: template.color,
                    border: '1px solid rgba(0,0,0,0.2)',
                  }} />
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {template.name}
                  </span>
                  {isHuman && numPlayers === 1 && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: '#c4a535' }}>★ VOUS</span>
                  )}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#6b5840', marginTop: 3 }}>
                  {template.description}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#8b7355', marginTop: 2 }}>
                  Stratégie IA: {template.aiStrategy}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          className="parchment-btn"
          style={{ padding: '10px 24px' }}
          onClick={() => setPhase('menu')}
        >
          ← Retour
        </button>
        <button
          className="parchment-btn parchment-btn-primary"
          style={{ padding: '10px 32px', fontSize: '1rem' }}
          onClick={handleStart}
          disabled={enabledFactions.length < 2}
        >
          Commencer la Conquête
        </button>
      </div>
    </div>
  );
}
