import { useGameStore } from '@/store/useGameStore';
import '@/styles/parchment.css';
import '@/styles/animations.css';

export function MainMenu() {
  const setPhase = useGameStore((s) => s.setPhase);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: `
        radial-gradient(ellipse at 50% 30%, rgba(196, 165, 53, 0.15) 0%, transparent 50%),
        linear-gradient(180deg, #f4e4c1 0%, #e8d4a8 50%, #dcc898 100%)
      `,
      gap: 20,
    }}>
      {/* Decorative top */}
      <div style={{
        width: 120,
        height: 2,
        background: 'linear-gradient(90deg, transparent, #8b7355, transparent)',
        marginBottom: -10,
      }} />

      {/* Title */}
      <div className="animate-fade-in" style={{ textAlign: 'center' }}>
        <h1
          className="parchment-title"
          style={{
            fontSize: '3.5rem',
            lineHeight: 1.1,
            marginBottom: 8,
            letterSpacing: '3px',
          }}
        >
          LYBLICS
        </h1>
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '1rem',
          color: '#6b5840',
          letterSpacing: '4px',
          textTransform: 'uppercase',
        }}>
          Conquête de Territoire
        </div>
      </div>

      {/* Decorative divider */}
      <div style={{
        width: 200,
        height: 1,
        background: 'linear-gradient(90deg, transparent, #8b7355, transparent)',
      }} />

      {/* Menu buttons */}
      <div className="animate-fade-in-up" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: 260,
        marginTop: 10,
      }}>
        <button
          className="parchment-btn parchment-btn-primary"
          style={{ padding: '14px 24px', fontSize: '1rem', letterSpacing: '1px' }}
          onClick={() => setPhase('setup')}
        >
          Nouvelle Partie
        </button>
        <button
          className="parchment-btn"
          style={{ padding: '10px 24px', fontSize: '0.85rem' }}
          disabled
        >
          Charger Partie
        </button>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        fontSize: '0.7rem',
        color: '#8b7355',
        fontFamily: "'MedievalSharp', serif",
        textAlign: 'center',
      }}>
        Un jeu de stratégie médiévale au tour par tour
        <br />
        <span style={{ fontSize: '0.6rem' }}>v0.1.0</span>
      </div>
    </div>
  );
}
