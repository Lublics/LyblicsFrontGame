import { useGameStore } from '@/store/useGameStore';
import '@/styles/animations.css';

const TYPE_COLORS: Record<string, string> = {
  combat: '#8b2500',
  diplomacy: '#4a7c9b',
  research: '#c4a535',
  resource: '#2e5e1a',
  victory: '#ffd700',
};

const TYPE_ICONS: Record<string, string> = {
  combat: '\u2694\uFE0F',
  diplomacy: '\uD83E\uDD1D',
  research: '\uD83D\uDD2C',
  resource: '\uD83D\uDCE6',
  victory: '\uD83C\uDFC6',
};

export function NotificationFeed() {
  const notifications = useGameStore((s) => s.notifications);
  const recent = notifications.slice(-5).reverse();

  if (recent.length === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 60,
      right: 12,
      width: 280,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      zIndex: 20,
      pointerEvents: 'none',
    }}>
      {recent.map((n) => (
        <div
          key={n.id}
          className="animate-notif"
          style={{
            padding: '6px 10px',
            background: 'rgba(244, 228, 193, 0.92)',
            border: `1px solid ${TYPE_COLORS[n.type] ?? '#8b7355'}`,
            borderLeft: `3px solid ${TYPE_COLORS[n.type] ?? '#8b7355'}`,
            borderRadius: 3,
            fontSize: '0.75rem',
            fontFamily: "'MedievalSharp', serif",
            color: '#2a1f14',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          }}
        >
          <span>{TYPE_ICONS[n.type] ?? ''} {n.message}</span>
        </div>
      ))}
    </div>
  );
}
