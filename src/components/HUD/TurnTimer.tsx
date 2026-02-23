import { useGameStore } from '@/store/useGameStore';

export function TurnTimer() {
  const tick = useGameStore((s) => s.tick);
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '6px 16px',
      fontFamily: "'Cinzel', serif",
    }}>
      <span style={{ fontSize: '0.75rem', color: '#6b5840' }}>
        Tour {Math.floor(tick / 2)}
      </span>
      <span style={{
        fontSize: '0.7rem',
        color: '#8b7355',
        fontFamily: 'monospace',
      }}>
        T:{tick}
      </span>
      <button
        className="parchment-btn"
        style={{ padding: '3px 12px', fontSize: '0.7rem' }}
        onClick={() => setPhase(phase === 'playing' ? 'paused' : 'playing')}
      >
        {phase === 'playing' ? '⏸ Pause' : '▶ Reprendre'}
      </button>
    </div>
  );
}
