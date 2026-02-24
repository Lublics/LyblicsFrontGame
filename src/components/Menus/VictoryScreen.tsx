import { useGameStore } from '@/store/useGameStore';
import '@/styles/parchment.css';
import '@/styles/animations.css';

const VICTORY_MESSAGES: Record<string, string> = {
  domination: 'Victoire par Domination!',
  elimination: 'Victoire par Élimination!',
  economic: 'Victoire Économique!',
};

const VICTORY_DESCRIPTIONS: Record<string, string> = {
  domination: 'Plus de 70% des territoires sont sous votre contrôle.',
  elimination: 'Toutes les factions adverses ont été éliminées.',
  economic: 'Votre trésor a atteint des sommets légendaires.',
};

export function VictoryScreen() {
  const winner = useGameStore((s) => s.winner);
  const factions = useGameStore((s) => s.factions);
  const victoryCondition = useGameStore((s) => s.victoryCondition);
  const turnNumber = useGameStore((s) => s.turnNumber);
  const resetGame = useGameStore((s) => s.resetGame);

  const winnerFaction = winner ? factions[winner] : null;

  if (!winnerFaction) return null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(42, 31, 20, 0.75)',
      zIndex: 100,
    }}>
      <div className="parchment-panel animate-fade-in-scale" style={{
        padding: '40px 50px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        maxWidth: 500,
      }}>
        <div style={{ fontSize: '3rem' }}>🏆</div>

        <h2 className="parchment-title" style={{ fontSize: '1.8rem' }}>
          {VICTORY_MESSAGES[victoryCondition]}
        </h2>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '1.2rem',
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
        }}>
          <span style={{
            width: 16, height: 16, borderRadius: '50%',
            background: winnerFaction.color,
            border: '2px solid rgba(0,0,0,0.2)',
          }} />
          {winnerFaction.name}
        </div>

        <div style={{ color: '#6b5840', fontSize: '0.85rem' }}>
          {VICTORY_DESCRIPTIONS[victoryCondition]}
        </div>

        <div style={{ width: 200, height: 1, background: 'linear-gradient(90deg, transparent, #8b7355, transparent)' }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px 24px',
          fontSize: '0.8rem',
          textAlign: 'left',
        }}>
          <div>Tours joués:</div>
          <div style={{ fontWeight: 600 }}>{turnNumber}</div>
          <div>Territoires:</div>
          <div style={{ fontWeight: 600 }}>{winnerFaction.territories.length}</div>
          <div>Or accumulé:</div>
          <div style={{ fontWeight: 600 }}>{Math.floor(winnerFaction.resources.gold)}</div>
          <div>Technologies:</div>
          <div style={{ fontWeight: 600 }}>{winnerFaction.techResearched.length}</div>
        </div>

        <div style={{ width: 200, height: 1, background: 'linear-gradient(90deg, transparent, #8b7355, transparent)' }} />

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            className="parchment-btn parchment-btn-primary"
            style={{ padding: '12px 32px', fontSize: '1rem' }}
            onClick={() => resetGame()}
          >
            Nouvelle Partie
          </button>
        </div>
      </div>
    </div>
  );
}
