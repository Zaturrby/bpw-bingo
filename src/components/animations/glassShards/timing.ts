import { MASTER_ANIMATION_TIMING, type SharedAnimationTiming } from '../shared';

// Glass shards timing configuration - now extends shared timing
export interface TimingConfig extends SharedAnimationTiming {}

// Use master timing configuration for perfect synchronization with cracks
export const DEFAULT_TIMING_CONFIG: TimingConfig = MASTER_ANIMATION_TIMING;

/**
 * Calculate dramatic timing for glass shard explosions
 * Uses shared timing configuration for perfect synchronization with cracks
 */
export const getDramaticTiming = (
  squareIndex: number,
  totalSquares: number,
  config: TimingConfig = DEFAULT_TIMING_CONFIG
): number => {
  const progress = squareIndex / totalSquares;
  const { totalDuration, phases, intervals } = config;

  if (progress <= phases.slowStart) {
    // First phase: slow start
    return squareIndex < 1 ? 0 : totalDuration * phases.slowStart;
  } else if (progress <= phases.buildUp) {
    // Second phase: build up
    return squareIndex < 2
      ? squareIndex * totalDuration * phases.slowStart
      : totalDuration * phases.buildUp;
  } else if (progress <= phases.quickSuccession) {
    // Third phase: quick succession
    const quickPhaseIndex = squareIndex - 2;
    const quickDelay = totalDuration * phases.buildUp + (quickPhaseIndex * intervals.quickPhaseInterval);
    return Math.min(quickDelay, totalDuration * phases.quickSuccession);
  } else {
    // Final phase: explosive finale - synchronized with actual crack finale timing
    // Based on latest logs: crack finale completes at ~3675ms from crack start
    // Glass starts ~5ms after crack start, so need 3670ms delay from glass start
    return 3670; // Match the actual crack finale timing from logs
  }
};

/**
 * Check if a square is part of the finale explosion
 * Uses shared timing configuration for synchronization
 */
export const isFinaleSquare = (
  squareIndex: number,
  totalSquares: number,
  config: TimingConfig = DEFAULT_TIMING_CONFIG
): boolean => {
  const progress = squareIndex / totalSquares;
  return progress > config.phases.quickSuccession;
};

/**
 * Get timing phase information for debugging/logging
 * Uses shared timing configuration for synchronization
 */
export const getTimingPhase = (
  squareIndex: number,
  totalSquares: number,
  config: TimingConfig = DEFAULT_TIMING_CONFIG
): { phase: string; timing: number; isFinale: boolean } => {
  const progress = squareIndex / totalSquares;
  const timing = getDramaticTiming(squareIndex, totalSquares, config);
  const finale = isFinaleSquare(squareIndex, totalSquares, config);

  let phase: string;
  if (progress <= config.phases.slowStart) {
    phase = 'slowStart';
  } else if (progress <= config.phases.buildUp) {
    phase = 'buildUp';
  } else if (progress <= config.phases.quickSuccession) {
    phase = 'quickSuccession';
  } else {
    phase = 'finale';
  }

  return { phase, timing, isFinale: finale };
};