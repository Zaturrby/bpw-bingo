// Types
export * from './types';

// React Component
export { CrackOverlay } from './CrackOverlay';

// Core functionality
export { generateFullCrack } from './generator';
export { updateCracks } from './updater';
export { drawCrack } from './renderer';
export { detectAndHandlePageReload } from './utils';

// Finale system
export * from './finale';

// Timing system
export {
  getSuspensefulCrackCount,
  getCrackTimingPhase,
  shouldTriggerFinale as shouldTriggerFinaleFromTiming,
  calculateAnimationProgress,
  DEFAULT_CRACK_TIMING_CONFIG
} from './timing';
export type { CrackTimingConfig } from './timing';

// Storage
export {
  getSquareCracks,
  getFinaleStartTime,
  getFinaleComplete,
  setFinaleStartTime,
  setFinaleComplete,
  clearAllCracks,
  resetSquareCracks,
  globalFinaleStartTime,
  globalFinaleComplete,
  globalCrackStorage
} from './storage';