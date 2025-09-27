
import React from 'react';
import PixelatedButton from './PixelatedButton';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white p-8 z-30 relative text-shadow-hard">
      <h1 className="text-3xl md:text-6xl mb-4 text-center">Exodus Dash</h1>
      <h2 className="text-xl md:text-4xl mb-12 text-yellow-300 text-center">Pixel Pilgrimage</h2>
      
      {/* Desktop instructions */}
      <div className="mb-8 text-center hidden md:block text-sm md:text-base">
        <p className="mb-2">[Spacebar] or [Up Arrow] to Jump</p>
        <p>[Down Arrow] to Duck</p>
      </div>
      
      {/* Mobile instructions */}
      <div className="mb-8 text-center md:hidden text-sm md:text-base">
        <p className="mb-2">Tap right side to Jump</p>
        <p>Tap left side to Duck</p>
      </div>

      <PixelatedButton onClick={onStart}>
        Start Game
      </PixelatedButton>
    </div>
  );
};

export default StartScreen;