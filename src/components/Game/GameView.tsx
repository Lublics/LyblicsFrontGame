import { useState, useEffect } from 'react';
import { GameMap } from '@/components/Map/GameMap';
import { HUD } from '@/components/HUD/HUD';
import { NotificationFeed } from '@/components/HUD/NotificationFeed';
import { MiniMap } from '@/components/HUD/MiniMap';
import { FactionPanel } from '@/components/HUD/FactionPanel';
import { AITurnOverlay } from '@/components/HUD/AITurnOverlay';
import { TerritoryPanel } from '@/components/Panels/TerritoryPanel';
import { TrainPanel } from '@/components/Panels/TrainPanel';
import { TechPanel } from '@/components/Panels/TechPanel';
import { DiplomacyPanel } from '@/components/Panels/DiplomacyPanel';
import { PauseMenu } from '@/components/Menus/PauseMenu';
import { useGameStore } from '@/store/useGameStore';
import { endPlayerTurn } from '@/engine/tickProcessor';
import '@/styles/parchment.css';

type SideTab = 'territory' | 'train' | 'tech' | 'diplomacy';

export function GameView() {
  const [activeTab, setActiveTab] = useState<SideTab>('territory');
  const [showMenu, setShowMenu] = useState(false);
  const actionPoints = useGameStore((s) => s.actionPoints);
  const phase = useGameStore((s) => s.phase);

  // Auto-end turn when AP reaches 0
  useEffect(() => {
    if (phase === 'player_turn' && actionPoints <= 0) {
      const timer = setTimeout(() => endPlayerTurn(), 600);
      return () => clearTimeout(timer);
    }
  }, [actionPoints, phase]);

  const tabs: { id: SideTab; label: string; icon: string }[] = [
    { id: 'territory', label: 'Territoire', icon: '🏰' },
    { id: 'train', label: 'Armée', icon: '⚔' },
    { id: 'tech', label: 'Recherche', icon: '📜' },
    { id: 'diplomacy', label: 'Diplomatie', icon: '🤝' },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Top HUD */}
      <HUD onMenuToggle={() => setShowMenu(true)} />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Map */}
        <GameMap />

        {/* Overlays */}
        <NotificationFeed />
        <MiniMap />
        <FactionPanel />

        {/* AI Turn overlay */}
        {phase === 'ai_turn' && <AITurnOverlay />}

        {/* Menu overlay */}
        {showMenu && <PauseMenu onClose={() => setShowMenu(false)} />}

        {/* Right panel */}
        <div style={{
          width: 280,
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '2px solid #8b7355',
          background: 'rgba(244, 228, 193, 0.95)',
        }}>
          {/* Tab bar */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #8b7355',
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  fontSize: '0.65rem',
                  fontFamily: "'Cinzel', serif",
                  fontWeight: activeTab === tab.id ? 700 : 400,
                  background: activeTab === tab.id
                    ? 'rgba(244, 228, 193, 1)'
                    : 'rgba(212, 196, 161, 0.5)',
                  borderBottom: activeTab === tab.id ? '2px solid #c4a535' : '2px solid transparent',
                  color: activeTab === tab.id ? '#2a1f14' : '#6b5840',
                  cursor: 'pointer',
                  border: 'none',
                  borderRight: '1px solid rgba(139,115,85,0.2)',
                  transition: 'all 0.15s',
                }}
              >
                <div>{tab.icon}</div>
                <div>{tab.label}</div>
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {activeTab === 'territory' && <TerritoryPanel />}
            {activeTab === 'train' && <TrainPanel />}
            {activeTab === 'tech' && <TechPanel />}
            {activeTab === 'diplomacy' && <DiplomacyPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}
