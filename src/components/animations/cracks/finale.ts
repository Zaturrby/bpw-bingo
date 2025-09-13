import { generateFullCrack } from './generator';
import { CrackStorage, Crack } from './types';
import {
  getFinaleStartTime,
  getFinaleComplete,
  setFinaleStartTime,
  setFinaleComplete
} from './storage';

export interface FinaleConfig {
  triggerThreshold: number; // Number of squares needed to trigger finale
  animationDuration: number; // Duration in milliseconds
  extraCracks: number; // Number of extra cracks to generate
  logProgress: boolean; // Whether to log animation progress
}

export const DEFAULT_FINALE_CONFIG: FinaleConfig = {
  triggerThreshold: 25,
  animationDuration: 4000, // 4 seconds for dramatic effect
  extraCracks: 50, // Halved the amount
  logProgress: false // Only show trigger log
};

export const shouldTriggerFinale = (selectedCount: number, config: FinaleConfig = DEFAULT_FINALE_CONFIG): boolean => {
  return selectedCount >= config.triggerThreshold && !getFinaleComplete();
};

// Global to track if we've logged the trigger (only once across all squares)
let hasLoggedTrigger = false;

export const initializeFinale = (): void => {
  if (!getFinaleStartTime()) {
    if (!hasLoggedTrigger) {
      console.log(`🎯 FINALE TRIGGERED! Starting suspenseful crack cascade...`);
      hasLoggedTrigger = true;
    }
    setFinaleStartTime(Date.now());
  }
};

// Suspenseful crack timing: slow start, then quick succession, then explosive finale
const getSuspensefulCrackCount = (progress: number, totalCracks: number): number => {
  if (progress <= 0.2) {
    // First 20%: 1 crack (0.8 seconds)
    return 1;
  } else if (progress <= 0.4) {
    // Next 20%: add 1 more crack (1.6 seconds total)
    return 2;
  } else if (progress <= 0.7) {
    // Next 30%: add a few quickly (2.8 seconds total)
    const quickCracks = Math.floor((progress - 0.4) / 0.3 * 8); // 8 cracks in this phase
    return 2 + quickCracks;
  } else {
    // Final 30%: explosive finale - all remaining cracks
    return totalCracks;
  }
};

export const calculateFinaleProgress = (config: FinaleConfig = DEFAULT_FINALE_CONFIG): {
  elapsed: number;
  animationProgress: number;
  extraCracks: number;
  isComplete: boolean;
} => {
  const startTime = getFinaleStartTime();
  if (!startTime) {
    return { elapsed: 0, animationProgress: 0, extraCracks: 0, isComplete: false };
  }

  const elapsed = Date.now() - startTime;
  const animationProgress = Math.min(elapsed / config.animationDuration, 1);
  const extraCracks = getSuspensefulCrackCount(animationProgress, config.extraCracks);
  const isComplete = animationProgress >= 1;

  return { elapsed, animationProgress, extraCracks, isComplete };
};

export const logFinaleProgress = (
  progress: ReturnType<typeof calculateFinaleProgress>,
  squareId: number,
  squareCracks: CrackStorage,
  config: FinaleConfig = DEFAULT_FINALE_CONFIG
): void => {
  if (!config.logProgress || squareId !== 1) return;

  // Log every 10% progress to see the animation working
  const progressPercent = Math.floor(progress.animationProgress * 10) * 10;
  if (progressPercent !== squareCracks.lastLoggedProgress) {
    console.log(
      `🔥 Animation progress: ${progressPercent}%, Extra cracks: ${progress.extraCracks}/${config.extraCracks}, Elapsed: ${progress.elapsed}ms`
    );
    squareCracks.lastLoggedProgress = progressPercent;
  }
};

export const generateFinaleCracks = (
  canvas: HTMLCanvasElement,
  selectedCount: number,
  squareId: number,
  currentCracks: number,
  targetCracks: number
): Crack[] => {
  const newCracksCount = targetCracks - currentCracks;
  if (squareId === 1 && newCracksCount > 0) {
    console.log(`Adding ${newCracksCount} new cracks. Total will be: ${targetCracks}`);
  }

  // Generate the new cracks
  const newCracks = [];
  for (let i = currentCracks; i < targetCracks; i++) {
    const newCrack = generateFullCrack(canvas, i, selectedCount, squareId);
    newCracks.push(newCrack);
  }

  return newCracks;
};

export const updateFinaleProgress = (progress: ReturnType<typeof calculateFinaleProgress>): void => {
  if (progress.isComplete) {
    setFinaleComplete(true);
  }
};

export const processFinale = (
  canvas: HTMLCanvasElement,
  selectedCount: number,
  squareId: number,
  squareCracks: CrackStorage,
  config: FinaleConfig = DEFAULT_FINALE_CONFIG
): number => {
  if (!shouldTriggerFinale(selectedCount, config)) {
    return Math.max(1, selectedCount); // No finale, return normal target
  }

  // Initialize finale if not started
  initializeFinale();

  // Calculate current progress
  const progress = calculateFinaleProgress(config);

  // Log progress
  logFinaleProgress(progress, squareId, squareCracks, config);

  // Update finale completion state
  updateFinaleProgress(progress);

  // Return target crack count (base + extra)
  return selectedCount + progress.extraCracks;
};