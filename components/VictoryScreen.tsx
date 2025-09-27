
import React from 'react';
import PixelatedButton from './PixelatedButton';

interface VictoryScreenProps {
  onRestart: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ onRestart }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white p-8 z-30 relative text-shadow-hard">
      <h1 className="text-4xl md:text-5xl mb-6 text-yellow-400">VICTORY!</h1>
      <p className="text-lg md:text-xl mb-8 text-center">You led all 12 Israelites to the Promised Land!</p>
      <div className="text-center text-sm md:text-base text-gray-300 italic max-w-2xl mx-auto mb-10 leading-relaxed">
        <p>"I am the Lord your God, who brought you up out of Egypt. Open wide your mouth and I will fill it."</p>
        <p className="mt-2 not-italic font-bold">- Psalm 81:10</p>
      </div>
      <PixelatedButton onClick={onRestart}>
        Play Again
      </PixelatedButton>
    </div>
  );
};

export default VictoryScreen;