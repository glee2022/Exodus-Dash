import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { Player, Obstacle, IsraelitePickup, ObstacleType, Position, Follower } from '../types';
import { useKeyPress } from '../hooks/useKeyPress';
import { useGameAudio } from '../hooks/useGameAudio';
import * as C from '../constants';

interface GameProps {
  onGameOver: (israelites: number, distance: number) => void;
  onVictory: (distance: number) => void;
  isPlaying: boolean;
}

const Game: React.FC<GameProps> = ({ onGameOver, onVictory, isPlaying }) => {
  const [player, setPlayer] = useState<Player>({
    x: C.PLAYER_INITIAL_X,
    y: C.PLAYER_INITIAL_Y,
    width: C.PLAYER_WIDTH,
    height: C.PLAYER_HEIGHT,
    velocityY: 0,
    isJumping: false,
    isDucking: false,
  });

  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [israelitePickups, setIsrealitePickups] = useState<IsraelitePickup[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [pathHistory, setPathHistory] = useState<Position[]>([]);
  
  const [health, setHealth] = useState(3);
  const [distance, setDistance] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(C.INITIAL_GAME_SPEED);
  const [nextObstacleSpawn, setNextObstacleSpawn] = useState(C.OBSTACLE_MIN_SPAWN_GAP);
  const [pickupMessage, setPickupMessage] = useState<{ text: string; id: number } | null>(null);
  const [jumpTouched, setJumpTouched] = useState(false);
  const [duckTouched, setDuckTouched] = useState(false);

  const gameLoopRef = useRef<number | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameWrapperRef = useRef<HTMLDivElement>(null);


  const { playJumpSound, playHitSound, playPickupSound } = useGameAudio();

  const spacePressed = useKeyPress(' ');
  const arrowUpPressed = useKeyPress('ArrowUp');
  const arrowDownPressed = useKeyPress('ArrowDown');

  const restartGame = useCallback(() => {
    // Use a more compact initial X position on mobile to give more reaction time
    const isMobile = window.innerWidth <= 768;
    setPlayer({
        x: isMobile ? C.PLAYER_MOBILE_INITIAL_X : C.PLAYER_INITIAL_X,
        y: C.PLAYER_INITIAL_Y,
        width: C.PLAYER_WIDTH,
        height: C.PLAYER_HEIGHT,
        velocityY: 0,
        isJumping: false,
        isDucking: false,
    });
    setObstacles([]);
    setIsrealitePickups([]);
    setFollowers([]);
    setPathHistory([]);
    setHealth(3);
    setDistance(0);
    setGameSpeed(C.INITIAL_GAME_SPEED);
    setNextObstacleSpawn(C.OBSTACLE_MIN_SPAWN_GAP);
  }, []);

  useEffect(() => {
    if (isPlaying) {
        restartGame();
    }
  }, [isPlaying, restartGame]);

  useLayoutEffect(() => {
    const scaleGame = () => {
      if (gameWrapperRef.current && gameContainerRef.current) {
        const { clientWidth, clientHeight } = gameWrapperRef.current;
        const scaleX = clientWidth / C.GAME_WIDTH;
        const scaleY = clientHeight / C.GAME_HEIGHT;
        const scale = Math.min(scaleX, scaleY);
        
        const scaledWidth = C.GAME_WIDTH * scale;
        const scaledHeight = C.GAME_HEIGHT * scale;
        
        const xOffset = (clientWidth - scaledWidth) / 2;
        const yOffset = (clientHeight - scaledHeight) / 2;

        const style = gameContainerRef.current.style;
        if (style) {
          style.transformOrigin = 'top left';
          style.transform = `translate(${xOffset}px, ${yOffset}px) scale(${scale})`;
        }
      }
    };
    
    scaleGame();
    window.addEventListener('resize', scaleGame);
    return () => window.removeEventListener('resize', scaleGame);
  }, []);

  const gameLoop = useCallback(() => {
    // Player Logic
    setPlayer(p => {
      let newVelocityY = p.velocityY + C.GRAVITY;
      let newY = p.y + newVelocityY;
      let newIsJumping = p.isJumping;

      const isDucking = (arrowDownPressed || duckTouched) && !newIsJumping;
      const newHeight = isDucking ? C.PLAYER_DUCK_HEIGHT : C.PLAYER_HEIGHT;
      const groundY = C.GAME_HEIGHT - C.GROUND_HEIGHT - newHeight;

      if (newY >= groundY) {
        newY = groundY;
        newVelocityY = 0;
        newIsJumping = false;
      }
      
      if ((spacePressed || arrowUpPressed || jumpTouched) && !newIsJumping && !isDucking) {
        newVelocityY = C.JUMP_FORCE;
        newIsJumping = true;
        playJumpSound();
      }

      return { ...p, y: newY, velocityY: newVelocityY, isJumping: newIsJumping, isDucking, height: newHeight };
    });

    setPathHistory(history => {
        const newHistory = [{ x: player.x, y: player.y, isDucking: player.isDucking }, ...history];
        return newHistory.slice(0, C.PATH_HISTORY_LENGTH);
    });

    // Update followers
    setFollowers(f => f.map((follower, index) => {
        const pathIndex = Math.min(pathHistory.length - 1, (index + 1) * C.FOLLOWER_SPACING);
        const targetPos = pathHistory[pathIndex];
        if (!targetPos) return follower;
        return {
            ...follower,
            x: targetPos.x - (index + 1) * (C.ISRAELITE_WIDTH / 2) - 30, // Adjust position behind player
            y: targetPos.y + (C.PLAYER_HEIGHT - C.ISRAELITE_HEIGHT),
        };
    }));


    // Move obstacles and pickups
    const move = <T extends {x: number}>(o: T): T => ({ ...o, x: o.x - gameSpeed });
    setObstacles(obs => obs.map(move).filter(o => o.x + o.width > 0));
    setIsrealitePickups(pups => pups.map(move).filter(p => p.x + p.width > 0));

    // Collision Detection
    const playerHitbox = { x: player.x + 10, y: player.y, width: player.width - 20, height: player.height }; 
    
    // Obstacles
    let collisionDetected = false;
    const remainingObstacles = obstacles.filter(o => {
        const obstacleHitbox = { x: o.x + 5, y: o.y, width: o.width - 10, height: o.height - 5 };
        if (playerHitbox.x < obstacleHitbox.x + obstacleHitbox.width && playerHitbox.x + playerHitbox.width > obstacleHitbox.x &&
            playerHitbox.y < obstacleHitbox.y + obstacleHitbox.height && playerHitbox.y + playerHitbox.height > obstacleHitbox.y) {
            collisionDetected = true;
            playHitSound();
            return false;
        }
        return true;
    });

    if (collisionDetected) {
        setHealth(h => {
            const newHealth = h - 1;
            if (newHealth <= 0) {
                onGameOver(followers.length, distance);
            }
            return newHealth;
        });
        setObstacles(remainingObstacles);
    }
    
    // Pickups
    setIsrealitePickups(pups => pups.filter(pup => {
         if (playerHitbox.x < pup.x + pup.width && playerHitbox.x + playerHitbox.width > pup.x &&
            playerHitbox.y < pup.y + pup.height && playerHitbox.y + playerHitbox.height > pup.y) {
            
            if (followers.length < C.MAX_ISRAELITES) {
                playPickupSound();
                setFollowers(f => {
                    const newFollowers = [...f, {
                        x: 0, y: 0, width: C.ISRAELITE_WIDTH, height: C.ISRAELITE_HEIGHT,
                        color: C.ISRAELITE_COLORS[f.length % C.ISRAELITE_COLORS.length]
                    }];
                    
                    if (newFollowers.length >= C.MAX_ISRAELITES) {
                        onVictory(distance);
                    }
                    return newFollowers;
                });
                
                const message = C.PICKUP_MESSAGES[Math.floor(Math.random() * C.PICKUP_MESSAGES.length)];
                const messageId = Date.now();
                setPickupMessage({ text: message, id: messageId });
                setTimeout(() => {
                    setPickupMessage(current => current?.id === messageId ? null : current);
                }, 2500);
            }
            return false;
         }
         return true;
    }));
    
    // Spawn new obstacles / pickups
    const lastObjectX = [...obstacles, ...israelitePickups].sort((a, b) => b.x - a.x)[0]?.x;
    if (lastObjectX === undefined || C.GAME_WIDTH - lastObjectX > nextObstacleSpawn) {
        const spawnX = C.GAME_WIDTH + 100;
        if (followers.length < C.MAX_ISRAELITES && Math.random() < C.ISRAELITE_PICKUP_SPAWN_RATE) {
            setIsrealitePickups(pups => [...pups, {
                x: spawnX,
                y: C.GAME_HEIGHT - C.GROUND_HEIGHT - C.ISRAELITE_HEIGHT,
                width: C.ISRAELITE_WIDTH,
                height: C.ISRAELITE_HEIGHT
            }]);
        } else {
             const config = C.OBSTACLE_CONFIGS[Math.floor(Math.random() * C.OBSTACLE_CONFIGS.length)];
             const newObstacle: Obstacle = {
                 x: spawnX,
                 y: config.y,
                 width: config.width,
                 height: config.height,
                 type: config.type as ObstacleType,
             };
             setObstacles(obs => [...obs, newObstacle]);
        }
        setNextObstacleSpawn(Math.random() * (C.OBSTACLE_MAX_SPAWN_GAP - C.OBSTACLE_MIN_SPAWN_GAP) + C.OBSTACLE_MIN_SPAWN_GAP);
    }

    // Update game state
    setDistance(d => d + gameSpeed / 10);
    setGameSpeed(s => s + C.GAME_SPEED_INCREMENT);

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [arrowDownPressed, arrowUpPressed, distance, followers.length, gameSpeed, nextObstacleSpawn, onGameOver, onVictory, obstacles, pathHistory, playHitSound, playJumpSound, playPickupSound, player.isDucking, player.x, player.y, spacePressed, israelitePickups, jumpTouched, duckTouched]);

  useEffect(() => {
    if (isPlaying && health > 0) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, health, isPlaying]);
  
  const getHearts = () => {
    const hearts = [];
    for (let i = 0; i < 3; i++) {
      hearts.push(
        <div key={i} className={`pixel-heart ${i < health ? '' : 'empty'}`}></div>
      );
    }
    return hearts;
  };

  const getObstacleClass = (type: ObstacleType) => {
    switch(type) {
      case ObstacleType.CACTUS: return 'cactus';
      case ObstacleType.ROCK_CLUSTER: return 'rock-cluster';
      case ObstacleType.SCORPION_GROUP: return 'scorpion-group';
      case ObstacleType.LOCUST_SWARM: return 'locust-swarm';
      default: return '';
    }
  };
  
  let playerClass = "jesus";
  if (player.isDucking) playerClass += " jesus-ducking";
  else if (player.isJumping) playerClass += " jesus-jumping";
  else playerClass += " jesus-running";

  // Calculate parallax offsets
  const pyramidsOffset = -(distance * 0.2) % (C.GAME_WIDTH * 2);
  const cloudsOffset = -(distance * 0.4) % (C.GAME_WIDTH * 2);

  return (
    <div ref={gameWrapperRef} className="w-full h-full relative overflow-hidden">
      <div
        ref={gameContainerRef}
        className="sky overflow-hidden absolute"
        style={{
          width: C.GAME_WIDTH,
          height: C.GAME_HEIGHT,
        }}
      >
       {/* Background Elements */}
        <div className="parallax-bg pyramids" style={{ backgroundPositionX: `${pyramidsOffset}px` }}></div>
        <div className="parallax-bg clouds" style={{ backgroundPositionX: `${cloudsOffset}px` }}></div>

        {/* UI Overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 text-white text-shadow-hard flex justify-between items-center text-lg">
          <div className="flex items-center gap-1">
              {getHearts()}
          </div>
          <h1 className="text-3xl text-yellow-300">Exodus Dash</h1>
          <div>Israelites: {followers.length}/{C.MAX_ISRAELITES}</div>
        </div>

        {/* Game World */}
        <div className="absolute inset-0 z-10">
          {/* Ground */}
          <div className="ground" style={{ height: C.GROUND_HEIGHT }}></div>

          {/* Player (Jesus) */}
          <div className={playerClass} style={{ left: player.x, top: player.y }}>
              <div className="jesus-aura"></div>
              <div className="jesus-sprite" style={{ height: player.height }}></div>
          </div>

          {/* Followers (Israelites) */}
          {followers.map((f, i) => (
              <div key={i} className="follower-sprite" style={{ left: f.x, top: f.y, backgroundImage: `url("${f.color}")` }}></div>
          ))}
          
          {/* Obstacles */}
          {obstacles.map((o, i) => (
              <div key={`obs-${i}`} className={`obstacle-sprite ${getObstacleClass(o.type)}`} style={{ left: o.x, top: o.y, width: o.width, height: o.height }}>
              </div>
          ))}

          {/* Israelite Pickups */}
          {israelitePickups.map((p, i) => (
              <div key={`pup-${i}`} className="israelite-pickup" style={{ left: p.x, top: p.y, width: p.width, height: p.height }}></div>
          ))}
        </div>
        
        {/* Pickup Message */}
        {pickupMessage && (
          <div key={pickupMessage.id} className="absolute top-1/2 left-1/2 z-30 p-4 bg-black/70 rounded-lg text-lg text-center animate-fade-in-out text-white" style={{textShadow: '2px 2px #000'}}>
            {pickupMessage.text}
          </div>
        )}

        {/* Distance Bar */}
        <div className="distance-bar">
          <div className="distance-progress" style={{ width: `${(followers.length / C.MAX_ISRAELITES) * 100}%` }}></div>
          <div className="absolute inset-0 flex items-center justify-center text-black font-bold text-sm">
            {Math.floor(distance)}m Traveled
          </div>
        </div>
      </div>
      <div className="touch-controls">
          <div
              className="touch-button-duck"
              onTouchStart={(e) => { e.preventDefault(); setDuckTouched(true); }}
              onTouchEnd={(e) => { e.preventDefault(); setDuckTouched(false); }}
              onContextMenu={(e) => e.preventDefault()}
          >
              <span>DUCK</span>
          </div>
          <div
              className="touch-button-jump"
              onTouchStart={(e) => { e.preventDefault(); setJumpTouched(true); }}
              onTouchEnd={(e) => { e.preventDefault(); setJumpTouched(false); }}
              onContextMenu={(e) => e.preventDefault()}
          >
              <span>JUMP</span>
          </div>
      </div>
    </div>
  );
};

export default Game;