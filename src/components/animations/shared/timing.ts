/**
 * Shared timing configuration for synchronized animations
 * This ensures cracks and glass shards are perfectly aligned
 */

export interface SharedAnimationTiming {
  totalDuration: number; // Total animation duration in milliseconds
  triggerThreshold: number; // Number of squares needed to trigger finale
  phases: {
    slowStart: number; // 0.2 = 20%
    buildUp: number; // 0.4 = 40%
    quickSuccession: number; // 0.7 = 70%
    finale: number; // 1.0 = 100%
  };
  intervals: {
    quickPhaseInterval: number; // milliseconds between quick succession events
  };
  crackDistribution: {
    slowStartCracks: number; // Number of cracks in slow start
    buildUpCracks: number; // Number of cracks in build up
    quickSuccessionCracks: number; // Number of cracks in quick succession phase
  };
}

/**
 * Master timing configuration used by both cracks and glass shards
 * Modify this to change the timing for both systems simultaneously
 */
export const MASTER_ANIMATION_TIMING: SharedAnimationTiming = {
  totalDuration: 4000, // 4 seconds for dramatic effect
  triggerThreshold: 25, // Trigger when all 25 squares are selected
  phases: {
    slowStart: 0.2, // First 20% (0-800ms)
    buildUp: 0.4, // Next 20% (800-1600ms)
    quickSuccession: 0.7, // Next 30% (1600-2800ms)
    finale: 1.0 // Final 30% (2800-4000ms)
  },
  intervals: {
    quickPhaseInterval: 150 // 150ms between quick succession events
  },
  crackDistribution: {
    slowStartCracks: 1, // 1 crack in first 20%
    buildUpCracks: 2, // 2 total cracks by 40%
    quickSuccessionCracks: 8 // 8 cracks in quick succession phase
  }
};

/**
 * Calculate animation progress based on elapsed time
 */
export const calculateSharedAnimationProgress = (
  startTime: number | null,
  config: SharedAnimationTiming = MASTER_ANIMATION_TIMING
): {
  elapsed: number;
  animationProgress: number;
  isComplete: boolean;
  phase: string;
  phaseProgress: number;
} => {
  if (!startTime) {
    return {
      elapsed: 0,
      animationProgress: 0,
      isComplete: false,
      phase: 'waiting',
      phaseProgress: 0,
    };
  }

  const elapsed = Date.now() - startTime;
  const animationProgress = Math.min(elapsed / config.totalDuration, 1);
  const isComplete = animationProgress >= 1;

  // Calculate current phase
  let phase: string;
  let phaseProgress: number;

  if (animationProgress <= config.phases.slowStart) {
    phase = 'slowStart';
    phaseProgress = animationProgress / config.phases.slowStart;
  } else if (animationProgress <= config.phases.buildUp) {
    phase = 'buildUp';
    phaseProgress = (animationProgress - config.phases.slowStart) / (config.phases.buildUp - config.phases.slowStart);
  } else if (animationProgress <= config.phases.quickSuccession) {
    phase = 'quickSuccession';
    phaseProgress = (animationProgress - config.phases.buildUp) / (config.phases.quickSuccession - config.phases.buildUp);
  } else {
    phase = 'finale';
    phaseProgress = (animationProgress - config.phases.quickSuccession) / (config.phases.finale - config.phases.quickSuccession);
  }

  return { elapsed, animationProgress, isComplete, phase, phaseProgress };
};

/**
 * Check if finale should be triggered
 */
export const shouldTriggerSharedFinale = (
  selectedCount: number,
  isComplete: boolean,
  config: SharedAnimationTiming = MASTER_ANIMATION_TIMING
): boolean => {
  return selectedCount >= config.triggerThreshold && !isComplete;
};

/**
 * Get timing milestones for synchronization
 */
export const getTimingMilestones = (
  config: SharedAnimationTiming = MASTER_ANIMATION_TIMING
): {
  slowStartEnd: number;
  buildUpEnd: number;
  quickSuccessionEnd: number;
  finaleStart: number;
  finaleEnd: number;
} => {
  return {
    slowStartEnd: config.totalDuration * config.phases.slowStart, // 800ms
    buildUpEnd: config.totalDuration * config.phases.buildUp, // 1600ms
    quickSuccessionEnd: config.totalDuration * config.phases.quickSuccession, // 2800ms
    finaleStart: config.totalDuration * config.phases.quickSuccession, // 2800ms
    finaleEnd: config.totalDuration * config.phases.finale, // 4000ms
  };
};