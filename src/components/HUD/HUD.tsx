import { ResourceBar } from './ResourceBar';
import { TurnTimer } from './TurnTimer';

export function HUD() {
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
      <TurnTimer />
    </div>
  );
}
