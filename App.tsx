import React, { useState, useCallback } from 'react';
import Game from './components/Game';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import VictoryScreen from './components/VictoryScreen';
import CelebrationAnimation from './components/CelebrationAnimation';
import { GameState } from './types';
import * as C from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [finalScore, setFinalScore] = useState({ israelites: 0, distance: 0 });

  const handleStart = useCallback(() => {
    setGameState(GameState.PLAYING);
  }, []);

  const handleGameOver = useCallback((israelites: number, distance: number) => {
    setFinalScore({ israelites, distance: Math.floor(distance) });
    setGameState(GameState.GAME_OVER);
  }, []);
  
  const handleVictory = useCallback((distance: number) => {
    setFinalScore({ israelites: 12, distance: Math.floor(distance) });
    setGameState(GameState.CELEBRATING);
    setTimeout(() => {
      setGameState(GameState.VICTORY);
    }, 4000); // 4 second celebration
  }, []);

  const handleRestart = useCallback(() => {
    setGameState(GameState.PLAYING);
  }, []);

  const renderContent = () => {
    const isGameActive = gameState === GameState.PLAYING;
    const game = <Game onGameOver={handleGameOver} onVictory={handleVictory} isPlaying={isGameActive} />;
    
    switch (gameState) {
      case GameState.START:
        return <><StartScreen onStart={handleStart} />{game}</>;
      case GameState.PLAYING:
        return game;
      case GameState.GAME_OVER:
        return <><GameOverScreen score={finalScore} onRestart={handleRestart} />{game}</>;
      case GameState.CELEBRATING:
        return <CelebrationAnimation />;
      case GameState.VICTORY:
        return <><VictoryScreen onRestart={handleRestart} />{game}</>;
      default:
        return <><StartScreen onStart={handleStart} />{game}</>;
    }
  };

  return (
    <div className="min-h-screen h-screen flex items-center justify-center md:p-4" style={{'--ground-height': `${C.GROUND_HEIGHT}px`} as React.CSSProperties}>
      <div className="crt-container">
        <div className="crt-frame">
          <div className="crt-screen">
            {renderContent()}
          </div>
          <div className="crt-glare"></div>
        </div>
      </div>
    </div>
  );
};

export default App;