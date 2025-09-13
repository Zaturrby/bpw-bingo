/**
 * Simplified timing system for glass shards
 * No complex phases - just direct timing values
 */

export interface SimpleTimingConfig {
  // Direct timing values in milliseconds
  firstExplosion: number;
  secondExplosion: number;
  quickSuccessionStart: number;
  quickSuccessionInterval: number;
  finaleExplosion: number;
}

export const SIMPLE_TIMING: SimpleTimingConfig = {
  firstExplosion: 0, // First square explodes immediately
  secondExplosion: 800, // Second square at 800ms
  quickSuccessionStart: 1600, // Quick succession starts at 1600ms
  quickSuccessionInterval: 150, // 150ms between quick explosions
  finaleExplosion: 5500, // Finale explosion at very end of animation cycle (4000ms) to align with crack finale completion
};

/**
 * Get explosion timing for a specific square
 * Simple, direct calculation with no complex phases
 */
export const getSimpleExplosionTiming = (
  squareIndex: number,
  totalSquares: number,
  config: SimpleTimingConfig = SIMPLE_TIMING
): number => {
  // First square
  if (squareIndex === 0) {
    return config.firstExplosion; // 0ms
  }

  // Second square
  if (squareIndex === 1) {
    return config.secondExplosion; // 800ms
  }

  // Quick succession squares (2-17 for 5x5 grid)
  if (squareIndex < Math.floor(totalSquares * 0.7)) {
    const quickIndex = squareIndex - 2;
    return (
      config.quickSuccessionStart + quickIndex * config.quickSuccessionInterval
    );
  }

  // Finale squares (last ~30%)
  return config.finaleExplosion; // 2800ms
};

/**
 * Check if square is part of finale
 */
export const isSimpleFinaleSquare = (
  squareIndex: number,
  totalSquares: number
): boolean => {
  return squareIndex >= Math.floor(totalSquares * 0.7);
};
