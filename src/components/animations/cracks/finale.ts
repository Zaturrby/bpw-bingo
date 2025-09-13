import { generateFullCrack } from "./generator";
import { CrackStorage, Crack } from "./types";
import {
  getFinaleStartTime,
  getFinaleComplete,
  setFinaleStartTime,
  setFinaleComplete,
} from "./storage";
import {
  shouldTriggerFinale as shouldTriggerFinaleFromTiming,
  calculateAnimationProgress,
  getCrackTimingPhase,
  DEFAULT_CRACK_TIMING_CONFIG,
} from "./timing";

// Legacy interface for backward compatibility
export interface FinaleConfig {
  triggerThreshold: number;
  animationDuration: number;
  extraCracks: number;
  logProgress: boolean;
}

// Legacy config - now uses timing module internally
export const DEFAULT_FINALE_CONFIG: FinaleConfig = {
  triggerThreshold: DEFAULT_CRACK_TIMING_CONFIG.triggerThreshold,
  animationDuration: DEFAULT_CRACK_TIMING_CONFIG.totalDuration,
  extraCracks: 50,
  logProgress: false,
};

export const shouldTriggerFinale = (
  selectedCount: number,
  _config: FinaleConfig = DEFAULT_FINALE_CONFIG
): boolean => {
  return shouldTriggerFinaleFromTiming(selectedCount, getFinaleComplete());
};

export const initializeFinale = (): void => {
  if (!getFinaleStartTime()) {
    const startTime = Date.now();
    setFinaleStartTime(startTime);
  }
};

// Timing logic moved to timing.ts module

export const calculateFinaleProgress = (
  _config: FinaleConfig = DEFAULT_FINALE_CONFIG
): {
  elapsed: number;
  animationProgress: number;
  extraCracks: number;
  isComplete: boolean;
} => {
  const startTime = getFinaleStartTime();
  return calculateAnimationProgress(startTime || null);
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
    const phaseInfo = getCrackTimingPhase(progress.animationProgress);
    console.log(
      `🔥 Animation progress: ${progressPercent}%, Phase: ${phaseInfo.phase}, Extra cracks: ${progress.extraCracks}/${config.extraCracks}, Elapsed: ${progress.elapsed}ms`
    );
    squareCracks.lastLoggedProgress = progressPercent;
  }
};

export const generateFinaleCracks = (
  _canvas: HTMLCanvasElement,
  selectedCount: number,
  squareId: number,
  currentCracks: number,
  targetCracks: number
): Crack[] => {
  const newCracksCount = targetCracks - currentCracks;
  if (squareId === 1 && newCracksCount > 0) {
    const currentTime = Date.now();
    const startTime = getFinaleStartTime();
    const elapsed = startTime ? currentTime - startTime : 0;
    const logMessage = `Adding ${newCracksCount} new cracks. Total: ${targetCracks}`;

    // Phase-based logging with elapsed time
    if (newCracksCount >= 40) {
      console.log(`💥 FINALE BURST (${elapsed}ms): ${logMessage}`);
    } else if (elapsed <= 1000) {
      console.log(`🌱 SLOW START (${elapsed}ms): ${logMessage}`);
    } else if (elapsed <= 2000) {
      console.log(`⚡ BUILD UP (${elapsed}ms): ${logMessage}`);
    } else {
      console.log(`🚀 QUICK SUCCESSION (${elapsed}ms): ${logMessage}`);
    }
  }

  // Generate the new cracks
  const newCracks = [];
  for (let i = currentCracks; i < targetCracks; i++) {
    const newCrack = generateFullCrack(_canvas, i, selectedCount, squareId);
    newCracks.push(newCrack);
  }

  return newCracks;
};

export const updateFinaleProgress = (
  progress: ReturnType<typeof calculateFinaleProgress>
): void => {
  if (progress.isComplete && !getFinaleComplete()) {
    setFinaleComplete(true);
  }
};

export const processFinale = (
  _canvas: HTMLCanvasElement,
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
