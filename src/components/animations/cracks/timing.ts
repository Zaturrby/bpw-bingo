import { MASTER_ANIMATION_TIMING, type SharedAnimationTiming } from '../shared';

// Legacy interface for backward compatibility - now extends shared timing
export interface CrackTimingConfig extends SharedAnimationTiming {}

// Use master timing configuration for perfect synchronization
export const DEFAULT_CRACK_TIMING_CONFIG: CrackTimingConfig = MASTER_ANIMATION_TIMING;

/**
 * Calculate suspenseful crack count based on animation progress
 * Matches the dramatic timing pattern: slow start, then quick succession, then explosive finale
 */
/**
 * Calculate suspenseful crack count using shared timing configuration
 */
export const getSuspensefulCrackCount = (
  progress: number,
  totalCracks: number,
  config: CrackTimingConfig = DEFAULT_CRACK_TIMING_CONFIG
): number => {
  const { phases, crackDistribution } = config;

  if (progress <= phases.slowStart) {
    // First phase: slow start
    return crackDistribution.slowStartCracks;
  } else if (progress <= phases.buildUp) {
    // Second phase: build up
    return crackDistribution.buildUpCracks;
  } else if (progress <= phases.quickSuccession) {
    // Third phase: quick succession
    const quickPhaseProgress = (progress - phases.buildUp) / (phases.quickSuccession - phases.buildUp);
    const quickCracks = Math.floor(quickPhaseProgress * crackDistribution.quickSuccessionCracks);
    return crackDistribution.buildUpCracks + quickCracks;
  } else {
    // Final phase: explosive finale - all remaining cracks
    return totalCracks;
  }
};

/**
 * Get timing phase information for debugging/logging
 */
/**
 * Get timing phase information using shared timing configuration
 */
export const getCrackTimingPhase = (
  progress: number,
  config: CrackTimingConfig = DEFAULT_CRACK_TIMING_CONFIG
): { phase: string; phaseProgress: number; isFinale: boolean } => {
  const { phases } = config;
  let phase: string;
  let phaseProgress: number;

  if (progress <= phases.slowStart) {
    phase = 'slowStart';
    phaseProgress = progress / phases.slowStart;
  } else if (progress <= phases.buildUp) {
    phase = 'buildUp';
    phaseProgress = (progress - phases.slowStart) / (phases.buildUp - phases.slowStart);
  } else if (progress <= phases.quickSuccession) {
    phase = 'quickSuccession';
    phaseProgress = (progress - phases.buildUp) / (phases.quickSuccession - phases.buildUp);
  } else {
    phase = 'finale';
    phaseProgress = (progress - phases.quickSuccession) / (phases.finale - phases.quickSuccession);
  }

  return {
    phase,
    phaseProgress,
    isFinale: progress > phases.quickSuccession
  };
};

/**
 * Check if finale should be triggered
 */
/**
 * Check if finale should be triggered using shared timing
 */
export const shouldTriggerFinale = (
  selectedCount: number,
  isComplete: boolean,
  config: CrackTimingConfig = DEFAULT_CRACK_TIMING_CONFIG
): boolean => {
  return selectedCount >= config.triggerThreshold && !isComplete;
};

/**
 * Calculate animation progress based on elapsed time
 */
/**
 * Calculate animation progress using shared timing (with crack-specific data)
 */
export const calculateAnimationProgress = (
  startTime: number | null,
  config: CrackTimingConfig = DEFAULT_CRACK_TIMING_CONFIG
): {
  elapsed: number;
  animationProgress: number;
  extraCracks: number;
  isComplete: boolean;
} => {
  if (!startTime) {
    return {
      elapsed: 0,
      animationProgress: 0,
      extraCracks: 0,
      isComplete: false,
    };
  }

  const elapsed = Date.now() - startTime;
  const animationProgress = Math.min(elapsed / config.totalDuration, 1);
  const extraCracks = getSuspensefulCrackCount(animationProgress, 50, config); // 50 extra cracks total
  const isComplete = animationProgress >= 1;

  return { elapsed, animationProgress, extraCracks, isComplete };
};