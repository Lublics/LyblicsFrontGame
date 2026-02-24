import { ResourceBar } from './ResourceBar';
import { TurnTimer } from './TurnTimer';

export function HUD({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #8b7355',
      background: 'rgba(244, 228, 193, 0.95)',
      zIndex: 10,
    }}>
      <ResourceBar />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <TurnTimer />
        <button
          className="parchment-btn"
          style={{ padding: '4px 10px', fontSize: '0.65rem', marginRight: 8 }}
          onClick={onMenuToggle}
        >
          Menu
        </button>
      </div>
    </div>
  );
}
