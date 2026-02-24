import { useGameStore } from '@/store/useGameStore';
import '@/styles/parchment.css';
import '@/styles/animations.css';

export function PauseMenu({ onClose }: { onClose: () => void }) {
  const resetGame = useGameStore((s) => s.resetGame);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(42, 31, 20, 0.6)',
      zIndex: 100,
    }}>
      <div className="parchment-panel animate-fade-in-scale" style={{
        padding: '32px 40px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        <h2 className="parchment-title" style={{ fontSize: '1.8rem' }}>
          Menu
        </h2>
        <div style={{ width: 150, height: 1, background: 'linear-gradient(90deg, transparent, #8b7355, transparent)', margin: '0 auto' }} />
        <button
          className="parchment-btn parchment-btn-primary"
          style={{ padding: '10px 32px' }}
          onClick={onClose}
        >
          Reprendre
        </button>
        <button
          className="parchment-btn parchment-btn-danger"
          style={{ padding: '10px 32px' }}
          onClick={() => resetGame()}
        >
          Quitter la Partie
        </button>
      </div>
    </div>
  );
}
