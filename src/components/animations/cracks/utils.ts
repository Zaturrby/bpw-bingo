import { getSquareCracks, clearAllCracks, resetSquareCracks } from './storage';

export const detectAndHandlePageReload = (globalProgress: number, squareId: number) => {
  const squareCracks = getSquareCracks(squareId);
  const currentSelectedCount = Math.round(globalProgress * 25);

  // If we have far fewer cracks than expected, this might be a page reload
  if (squareCracks.cracks.length === 0 && currentSelectedCount > 3) {
    // Clear all crack storage to ensure consistent regeneration
    clearAllCracks();
    // Reinitialize this square
    resetSquareCracks(squareId);
  }
};