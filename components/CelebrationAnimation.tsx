import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import * as C from '../constants';

const CelebrationAnimation: React.FC = () => {
  const [celebrationPhase, setCelebrationPhase] = useState('entering');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const timer = setTimeout(() => {
      setCelebrationPhase('jumping');
    }, 2000); // Wait 2 seconds for Israelites to run in
    return () => clearTimeout(timer);
  }, []);

  useLayoutEffect(() => {
    const scaleAnimation = () => {
      if (wrapperRef.current && containerRef.current) {
        const { clientWidth, clientHeight } = wrapperRef.current;
        const scaleX = clientWidth / C.GAME_WIDTH;
        const scaleY = clientHeight / C.GAME_HEIGHT;
        const scale = Math.min(scaleX, scaleY);

        const scaledWidth = C.GAME_WIDTH * scale;
        const scaledHeight = C.GAME_HEIGHT * scale;

        const xOffset = (clientWidth - scaledWidth) / 2;
        const yOffset = (clientHeight - scaledHeight) / 2;

        const style = containerRef.current.style;
        if (style) {
          style.transformOrigin = 'top left';
          style.transform = `translate(${xOffset}px, ${yOffset}px) scale(${scale})`;
        }
      }
    };

    scaleAnimation();
    window.addEventListener('resize', scaleAnimation);
    return () => window.removeEventListener('resize', scaleAnimation);
  }, []);

  const jesusX = C.GAME_WIDTH / 2 - C.PLAYER_WIDTH / 2;
  const jesusY = C.GAME_HEIGHT - C.GROUND_HEIGHT - C.PLAYER_HEIGHT;

  // Position Israelites in a crowd around Jesus
  const israeliteFinalPositions = [
    // Left group
    { x: jesusX - C.ISRAELITE_WIDTH * 1.5, side: 'left' },
    { x: jesusX - C.ISRAELITE_WIDTH * 2.5, side: 'left' },
    { x: jesusX - C.ISRAELITE_WIDTH * 3.5, side: 'left' },
    { x: jesusX - C.ISRAELITE_WIDTH * 1.8, side: 'left', row: 1 },
    { x: jesusX - C.ISRAELITE_WIDTH * 2.8, side: 'left', row: 1 },
    { x: jesusX - C.ISRAELITE_WIDTH * 3.8, side: 'left', row: 1 },
    // Right group
    { x: jesusX + C.PLAYER_WIDTH + C.ISRAELITE_WIDTH * 0.5, side: 'right' },
    { x: jesusX + C.PLAYER_WIDTH + C.ISRAELITE_WIDTH * 1.5, side: 'right' },
    { x: jesusX + C.PLAYER_WIDTH + C.ISRAELITE_WIDTH * 2.5, side: 'right' },
    { x: jesusX + C.PLAYER_WIDTH + C.ISRAELITE_WIDTH * 0.8, side: 'right', row: 1 },
    { x: jesusX + C.PLAYER_WIDTH + C.ISRAELITE_WIDTH * 1.8, side: 'right', row: 1 },
    { x: jesusX + C.PLAYER_WIDTH + C.ISRAELITE_WIDTH * 2.8, side: 'right', row: 1 },
  ];

  return (
    <div ref={wrapperRef} className="w-full h-full relative overflow-hidden">
      <div
        ref={containerRef}
        className="sky overflow-hidden absolute"
        style={{ width: C.GAME_WIDTH, height: C.GAME_HEIGHT }}
      >
        {/* Background Elements */}
        <div className="parallax-bg pyramids" style={{ bottom: C.GROUND_HEIGHT }}></div>
        <div className="ground" style={{ height: C.GROUND_HEIGHT }}></div>

        {/* Celebrating Jesus */}
        <div className="jesus jesus-celebrating" style={{ left: jesusX, top: jesusY, animation: 'fade-in 0.5s ease-in' }}>
          <div className="jesus-aura"></div>
          <div className="jesus-sprite"></div>
        </div>

        {/* Celebrating Israelites */}
        {C.ISRAELITE_COLORS.map((color, i) => {
          const pos = israeliteFinalPositions[i];
          const yPos = C.GAME_HEIGHT - C.GROUND_HEIGHT - C.ISRAELITE_HEIGHT - ((pos.row || 0) * 5); // Slightly stagger rows

          let className = 'follower-sprite';
          if (celebrationPhase === 'entering') {
            className += pos.side === 'left' ? ' run-in-from-left' : ' run-in-from-right';
          } else {
            className += ' israelite-celebrating';
          }

          return (
            <div
              key={i}
              className={className}
              style={{
                left: pos.x,
                top: yPos,
                backgroundImage: `url("${color}")`,
                // Stagger the entrance animation
                animationDelay: celebrationPhase === 'entering' ? `${i * 0.1}s` : `${Math.random() * 0.4}s`,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default CelebrationAnimation;
