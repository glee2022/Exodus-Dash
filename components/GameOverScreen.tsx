
import React from 'react';
import PixelatedButton from './PixelatedButton';

interface GameOverScreenProps {
  score: { israelites: number, distance: number };
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white p-8 z-30 relative text-shadow-hard">
      <h1 className="text-4xl md:text-5xl mb-6 text-red-500">GAME OVER!</h1>
      <p className="text-lg md:text-xl mb-8 text-center">You led {score.israelites} Israelites on your journey.</p>
       <p className="text-lg md:text-xl mb-8 text-center">Distance Traveled: {score.distance}</p>
      <PixelatedButton onClick={onRestart}>
        Try Again
      </PixelatedButton>
    </div>
  );
};

export default GameOverScreen;