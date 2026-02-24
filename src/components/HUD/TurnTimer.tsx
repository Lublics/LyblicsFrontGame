import { useGameStore } from '@/store/useGameStore';
import { endPlayerTurn } from '@/engine/tickProcessor';

export function TurnTimer() {
  const turnNumber = useGameStore((s) => s.turnNumber);
  const actionPoints = useGameStore((s) => s.actionPoints);
  const maxActionPoints = useGameStore((s) => s.maxActionPoints);
  const phase = useGameStore((s) => s.phase);

  const handleEndTurn = () => {
    if (phase !== 'player_turn') return;
    endPlayerTurn();
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '6px 16px',
      fontFamily: "'Cinzel', serif",
    }}>
      <span style={{ fontSize: '0.75rem', color: '#6b5840', fontWeight: 600 }}>
        Tour {turnNumber}
      </span>

      {/* AP display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: '0.7rem', color: '#c4a535', fontWeight: 600 }}>
          PA: {actionPoints}/{maxActionPoints}
        </span>
        <div style={{ display: 'flex', gap: 2 }}>
          {Array.from({ length: maxActionPoints }).map((_, i) => (
            <span key={i} style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: i < actionPoints ? '#c4a535' : 'rgba(139,115,85,0.25)',
              border: '1px solid #8b7355',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>
      </div>

      <button
        className="parchment-btn parchment-btn-primary"
        style={{ padding: '4px 14px', fontSize: '0.7rem' }}
        onClick={handleEndTurn}
        disabled={phase !== 'player_turn'}
      >
        {phase === 'ai_turn' ? 'Tour IA...' : 'Fin du Tour'}
      </button>
    </div>
  );
}
