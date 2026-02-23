import { useGameStore } from '@/store/useGameStore';
import { formatNumber } from '@/utils/formatters';
import '@/styles/parchment.css';

export function ResourceBar() {
  const activeFactionId = useGameStore((s) => s.activeFactionId);
  const faction = useGameStore((s) => activeFactionId ? s.factions[activeFactionId] : null);

  if (!faction) return null;

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      padding: '6px 16px',
      background: 'rgba(244, 228, 193, 0.95)',
      borderBottom: '2px solid #8b7355',
      fontFamily: "'Cinzel', serif",
      fontSize: '0.85rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{
          display: 'inline-block',
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: faction.color,
          border: '1px solid rgba(0,0,0,0.2)',
        }} />
        <strong style={{ letterSpacing: '1px' }}>{faction.name}</strong>
      </div>
      <div style={{ width: '1px', height: '20px', background: '#8b7355' }} />
      <ResourceItem icon="🪙" label="Or" value={faction.resources.gold} color="#c4a535" />
      <ResourceItem icon="🌾" label="Nourriture" value={faction.resources.food} color="#6b8e23" />
      <ResourceItem icon="🪵" label="Bois" value={faction.resources.wood} color="#8b5a2b" />
      <div style={{ width: '1px', height: '20px', background: '#8b7355' }} />
      <span style={{ fontSize: '0.75rem', color: '#6b5840' }}>
        Territoires: {faction.territories.length}
      </span>
    </div>
  );
}

function ResourceItem({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className="tooltip-container" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span>{icon}</span>
      <span style={{ fontWeight: 600, color }}>{formatNumber(value)}</span>
      <span className="tooltip-content">{label}</span>
    </div>
  );
}
