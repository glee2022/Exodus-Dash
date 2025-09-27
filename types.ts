export enum GameState {
  START,
  PLAYING,
  GAME_OVER,
  CELEBRATING,
  VICTORY,
}

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Player extends GameObject {
  velocityY: number;
  isJumping: boolean;
  isDucking:boolean;
}

export enum ObstacleType {
  ROCK_CLUSTER,
  CACTUS,
  SCORPION_GROUP,
  LOCUST_SWARM,
}

export interface Obstacle extends GameObject {
  type: ObstacleType;
}

export interface IsraelitePickup extends GameObject {}

export interface Follower extends GameObject {
  color: string;
}

export interface Position {
  x: number;
  y: number;
  isDucking: boolean;
}