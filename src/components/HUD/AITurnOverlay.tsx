import '@/styles/parchment.css';
import '@/styles/animations.css';

export function AITurnOverlay() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(42, 31, 20, 0.4)',
      zIndex: 50,
      pointerEvents: 'all',
    }}>
      <div className="parchment-panel animate-fade-in-scale" style={{
        padding: '24px 40px',
        textAlign: 'center',
      }}>
        <div className="parchment-heading" style={{ fontSize: '1rem', marginBottom: 8 }}>
          Les factions adverses agissent...
        </div>
        <div style={{ fontSize: '0.8rem', color: '#6b5840' }}>
          Veuillez patienter
        </div>
        <div className="animate-pulse" style={{
          marginTop: 12,
          fontSize: '1.5rem',
        }}>
          ⚔
        </div>
      </div>
    </div>
  );
}
