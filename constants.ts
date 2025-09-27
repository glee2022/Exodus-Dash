import { ObstacleType } from './types';

export const GAME_WIDTH = 1000;
export const GAME_HEIGHT = 562.5; // 16:9 aspect ratio

export const GROUND_HEIGHT = 120;
const PIXEL_SIZE = 3;

// Player sprite is 20x25 pixels
export const PLAYER_WIDTH = 20 * PIXEL_SIZE;
export const PLAYER_HEIGHT = 25 * PIXEL_SIZE;
// Ducking sprite is 20x18
export const PLAYER_DUCK_HEIGHT = 18 * PIXEL_SIZE;
export const PLAYER_INITIAL_X = 250;
export const PLAYER_MOBILE_INITIAL_X = 220; // More to the left for better visibility on mobile
export const PLAYER_INITIAL_Y = GAME_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT;

export const GRAVITY = 0.8;
export const JUMP_FORCE = -20;

export const INITIAL_GAME_SPEED = 6;
export const GAME_SPEED_INCREMENT = 0.002;

export const OBSTACLE_MIN_SPAWN_GAP = 400;
export const OBSTACLE_MAX_SPAWN_GAP = 800;

export const OBSTACLE_CONFIGS = [
  // rock_cluster is 32x16
  { type: ObstacleType.ROCK_CLUSTER, width: 32 * PIXEL_SIZE, height: 16 * PIXEL_SIZE, y: GAME_HEIGHT - GROUND_HEIGHT - (16 * PIXEL_SIZE) },
  // cactus is 16x20
  { type: ObstacleType.CACTUS, width: 16 * PIXEL_SIZE, height: 20 * PIXEL_SIZE, y: GAME_HEIGHT - GROUND_HEIGHT - (20 * PIXEL_SIZE) },
  // scorpion_group is 40x10
  { type: ObstacleType.SCORPION_GROUP, width: 40 * PIXEL_SIZE, height: 10 * PIXEL_SIZE, y: GAME_HEIGHT - GROUND_HEIGHT - (10 * PIXEL_SIZE) },
  // locust_swarm is 48x20, designed to be ducked under
  { 
    type: ObstacleType.LOCUST_SWARM, 
    width: 48 * PIXEL_SIZE, 
    height: 20 * PIXEL_SIZE, 
    y: GAME_HEIGHT - GROUND_HEIGHT - PLAYER_DUCK_HEIGHT - (20 * PIXEL_SIZE) - 5 // Positioned above a ducking player
  },
];

export const ISRAELITE_PICKUP_SPAWN_RATE = 0.3; // 30% chance to spawn an israelite instead of an obstacle
// Israelite sprite is 12x18
export const ISRAELITE_WIDTH = 12 * PIXEL_SIZE;
export const ISRAELITE_HEIGHT = 18 * PIXEL_SIZE;

export const FOLLOWER_SPACING = 15; 
export const ISRAELITE_COLORS = [
    // Brown
    "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 18'%3E%3Cpath fill='%23221815' d='M3 0h6v1H8v1H7v1H5V2H4V1H3V0zM4 3h4v1H4zM2 4h1v1H2zm7 0h1v1H9zM1 5h1v1H1zm9 0h1v1h-1zM0 6h1v1H0zm11 0h1v1h-1zM0 7h1v1H0zm11 0h1v1h-1zM0 8h1v5H0zm11 0h1v5h-1zM1 13h1v1H1zm9 0h1v1h-1zM2 14h8v1H2zM3 15h2v1H3zm4 0h2v1H7zM3 16h2v1H3zm4 0h2v1H7zM3 17h1v1H3zm5 0h1v1H8z'/%3E%3Cpath fill='%23f8f8f8' d='M3 1h5v1H3z'/%3E%3Cpath fill='%23634022' d='M5 2h2v1H5z'/%3E%3Cpath fill='%23f7b267' d='M4 4h4v2H4z'/%3E%3Cpath fill='%23a16207' d='M1 6h1v1H1zm9 0h1v1H9zM1 7h10v7H1z'/%3E%3Cpath fill='%23a86432' d='M4 15h1v2H4zm3 0h1v2H7z'/%3E%3Cpath fill='%235c3c1b' d='M2 7h1v1H2zm7 0h1v1H9zM2 8h8v5H2z'/%3E%3C/svg%3E",
    // Blue
    "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 18'%3E%3Cpath fill='%23221815' d='M3 0h6v1H8v1H7v1H5V2H4V1H3V0zM4 3h4v1H4zM2 4h1v1H2zm7 0h1v1H9zM1 5h1v1H1zm9 0h1v1h-1zM0 6h1v1H0zm11 0h1v1h-1zM0 7h1v1H0zm11 0h1v1h-1zM0 8h1v5H0zm11 0h1v5h-1zM1 13h1v1H1zm9 0h1v1h-1zM2 14h8v1H2zM3 15h2v1H3zm4 0h2v1H7zM3 16h2v1H3zm4 0h2v1H7zM3 17h1v1H3zm5 0h1v1H8z'/%3E%3Cpath fill='%23f8f8f8' d='M3 1h5v1H3z'/%3E%3Cpath fill='%23634022' d='M5 2h2v1H5z'/%3E%3Cpath fill='%23f7b267' d='M4 4h4v2H4z'/%3E%3Cpath fill='%231e40af' d='M1 6h1v1H1zm9 0h1v1H9zM1 7h10v7H1z'/%3E%3Cpath fill='%23a86432' d='M4 15h1v2H4zm3 0h1v2H7z'/%3E%3Cpath fill='%231e3a8a' d='M2 7h1v1H2zm7 0h1v1H9zM2 8h8v5H2z'/%3E%3C/svg%3E",
    // Green
    "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 18'%3E%3Cpath fill='%23221815' d='M3 0h6v1H8v1H7v1H5V2H4V1H3V0zM4 3h4v1H4zM2 4h1v1H2zm7 0h1v1H9zM1 5h1v1H1zm9 0h1v1h-1zM0 6h1v1H0zm11 0h1v1h-1zM0 7h1v1H0zm11 0h1v1h-1zM0 8h1v5H0zm11 0h1v5h-1zM1 13h1v1H1zm9 0h1v1h-1zM2 14h8v1H2zM3 15h2v1H3zm4 0h2v1H7zM3 16h2v1H3zm4 0h2v1H7zM3 17h1v1H3zm5 0h1v1H8z'/%3E%3Cpath fill='%23f8f8f8' d='M3 1h5v1H3z'/%3E%3Cpath fill='%23634022' d='M5 2h2v1H5z'/%3E%3Cpath fill='%23f7b267' d='M4 4h4v2H4z'/%3E%3Cpath fill='%23166534' d='M1 6h1v1H1zm9 0h1v1H9zM1 7h10v7H1z'/%3E%3Cpath fill='%23a86432' d='M4 15h1v2H4zm3 0h1v2H7z'/%3E%3Cpath fill='%2314532d' d='M2 7h1v1H2zm7 0h1v1H9zM2 8h8v5H2z'/%3E%3C/svg%3E",
    // White
    "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 18'%3E%3Cpath fill='%23221815' d='M3 0h6v1H8v1H7v1H5V2H4V1H3V0zM4 3h4v1H4zM2 4h1v1H2zm7 0h1v1H9zM1 5h1v1H1zm9 0h1v1h-1zM0 6h1v1H0zm11 0h1v1h-1zM0 7h1v1H0zm11 0h1v1h-1zM0 8h1v5H0zm11 0h1v5h-1zM1 13h1v1H1zm9 0h1v1h-1zM2 14h8v1H2zM3 15h2v1H3zm4 0h2v1H7zM3 16h2v1H3zm4 0h2v1H7zM3 17h1v1H3zm5 0h1v1H8z'/%3E%3Cpath fill='%23f8f8f8' d='M3 1h5v1H3z'/%3E%3Cpath fill='%23634022' d='M5 2h2v1H5z'/%3E%3Cpath fill='%23f7b267' d='M4 4h4v2H4z'/%3E%3Cpath fill='%23e2e8f0' d='M1 6h1v1H1zm9 0h1v1H9zM1 7h10v7H1z'/%3E%3Cpath fill='%23a86432' d='M4 15h1v2H4zm3 0h1v2H7z'/%3E%3Cpath fill='%2394a3b8' d='M2 7h1v1H2zm7 0h1v1H9zM2 8h8v5H2z'/%3E%3C/svg%3E",
    // Red
    "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 18'%3E%3Cpath fill='%23221815' d='M3 0h6v1H8v1H7v1H5V2H4V1H3V0zM4 3h4v1H4zM2 4h1v1H2zm7 0h1v1H9zM1 5h1v1H1zm9 0h1v1h-1zM0 6h1v1H0zm11 0h1v1h-1zM0 7h1v1H0zm11 0h1v1h-1zM0 8h1v5H0zm11 0h1v5h-1zM1 13h1v1H1zm9 0h1v1h-1zM2 14h8v1H2zM3 15h2v1H3zm4 0h2v1H7zM3 16h2v1H3zm4 0h2v1H7zM3 17h1v1H3zm5 0h1v1H8z'/%3E%3Cpath fill='%23f8f8f8' d='M3 1h5v1H3z'/%3E%3Cpath fill='%23634022' d='M5 2h2v1H5z'/%3E%3Cpath fill='%23f7b267' d='M4 4h4v2H4z'/%3E%3Cpath fill='%23b91c1c' d='M1 6h1v1H1zm9 0h1v1H9zM1 7h10v7H1z'/%3E%3Cpath fill='%23a86432' d='M4 15h1v2H4zm3 0h1v2H7z'/%3E%3Cpath fill='%23991b1b' d='M2 7h1v1H2zm7 0h1v1H9zM2 8h8v5H2z'/%3E%3C/svg%3E",
];

export const MAX_ISRAELITES = 12;

export const PATH_HISTORY_LENGTH = (MAX_ISRAELITES + 2) * FOLLOWER_SPACING;

export const PICKUP_MESSAGES = [
    "Another soul saved!",
    "The flock grows!",
    "Onward to the Promised Land!",
    "Faith will guide us.",
    "He makes a way in the desert.",
    "A new follower joins the path.",
    "Let my people go!",
    "Strength in numbers."
];