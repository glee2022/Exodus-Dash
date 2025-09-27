
import React from 'react';

interface PixelatedButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const PixelatedButton: React.FC<PixelatedButtonProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 md:px-8 md:py-4 bg-gray-500 text-white text-xl md:text-2xl uppercase border-4 border-solid
                 border-t-gray-300 border-l-gray-300 border-r-gray-800 border-b-gray-800
                 hover:bg-gray-400 active:bg-gray-600 active:border-t-gray-800 active:border-l-gray-800
                 active:border-r-gray-300 active:border-b-gray-300 transition-colors duration-75"
    >
      {children}
    </button>
  );
};

export default PixelatedButton;