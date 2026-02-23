import { useGameStore } from '@/store/useGameStore';

export function FactionPanel() {
  const factions = useGameStore((s) => s.factions);
  const activeFactionId = useGameStore((s) => s.activeFactionId);
  const aliveFactions = Object.values(factions).filter((f) => f.alive);

  return (
    <div
      className="parchment-panel"
      style={{
        position: 'absolute',
        bottom: 12,
        right: 12,
        padding: '8px 12px',
        zIndex: 15,
        minWidth: 160,
      }}
    >
      <div className="parchment-heading" style={{ fontSize: '0.75rem', marginBottom: 6 }}>
        Factions
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {aliveFactions.map((f) => (
          <div
            key={f.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.72rem',
              opacity: f.id === activeFactionId ? 1 : 0.7,
              fontWeight: f.id === activeFactionId ? 700 : 400,
            }}
          >
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: f.color,
              border: f.id === activeFactionId ? '2px solid #fff' : '1px solid rgba(0,0,0,0.2)',
              flexShrink: 0,
            }} />
            <span>{f.name}</span>
            <span style={{ marginLeft: 'auto', color: '#6b5840' }}>
              {f.territories.length}
            </span>
            {f.isHuman && (
              <span style={{ fontSize: '0.6rem', color: '#c4a535' }}>★</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
