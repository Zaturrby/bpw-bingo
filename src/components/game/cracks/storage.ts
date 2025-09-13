import { CrackStorage } from './types';

// Global finale state shared across all squares
export let globalFinaleStartTime: number | undefined = undefined;
export let globalFinaleComplete: boolean = false;

// Global crack storage to persist across component re-renders
export const globalCrackStorage = new Map<number, CrackStorage>();

export const getSquareCracks = (squareId: number): CrackStorage => {
  if (!globalCrackStorage.has(squareId)) {
    globalCrackStorage.set(squareId, {
      cracks: [],
      lastProgress: 0
    });
  }
  return globalCrackStorage.get(squareId)!;
};

export const getFinaleStartTime = (): number | undefined => {
  return globalFinaleStartTime;
};

export const getFinaleComplete = (): boolean => {
  return globalFinaleComplete;
};

export const setFinaleStartTime = (time: number | undefined) => {
  globalFinaleStartTime = time;
};

export const setFinaleComplete = (complete: boolean) => {
  globalFinaleComplete = complete;
};

export const clearAllCracks = () => {
  globalCrackStorage.clear();
  globalFinaleStartTime = undefined;
  globalFinaleComplete = false;
};

export const resetSquareCracks = (squareId: number) => {
  globalCrackStorage.set(squareId, {
    cracks: [],
    lastProgress: 0
  });
};