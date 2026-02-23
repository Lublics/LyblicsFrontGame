import { useGameStore } from '@/store/useGameStore';
import { useGameLoop } from '@/engine/useGameLoop';
import { MainMenu } from '@/components/Menus/MainMenu';
import { SetupScreen } from '@/components/Menus/SetupScreen';
import { PauseMenu } from '@/components/Menus/PauseMenu';
import { VictoryScreen } from '@/components/Menus/VictoryScreen';
import { GameView } from '@/components/Game/GameView';
import '@/styles/index.css';
import '@/styles/parchment.css';
import '@/styles/animations.css';

export default function App() {
  const phase = useGameStore((s) => s.phase);
  useGameLoop();

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {phase === 'menu' && <MainMenu />}
      {phase === 'setup' && <SetupScreen />}
      {(phase === 'playing' || phase === 'paused' || phase === 'victory') && <GameView />}
      {phase === 'paused' && <PauseMenu />}
      {phase === 'victory' && <VictoryScreen />}
    </div>
  );
}
