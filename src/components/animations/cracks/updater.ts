import { generateFullCrack } from './generator';
import { getSquareCracks } from './storage';
import { processFinale } from './finale';

export const updateCracks = (
  canvas: HTMLCanvasElement,
  globalProgress: number,
  squareId: number
) => {
  const squareCracks = getSquareCracks(squareId);
  const selectedCount = Math.round(globalProgress * 25); // Convert to actual square count

  // Calculate target cracks (includes finale logic)
  const targetCracks = processFinale(canvas, selectedCount, squareId, squareCracks);

  const currentCracks = squareCracks.cracks.length;

  // Only add new cracks if we need more
  if (targetCracks > currentCracks) {
    for (let i = currentCracks; i < targetCracks; i++) {
      const newCrack = generateFullCrack(canvas, i, selectedCount, squareId);
      squareCracks.cracks.push(newCrack);
    }
  }

  // Update progress of existing cracks (they grow and branch over time)
  squareCracks.cracks.forEach((crack, index) => {
    // FINALE: Show extra cracks immediately when they're generated
    if (selectedCount >= 25 && index >= selectedCount) {
      // This is an extra finale crack - show it immediately at full visibility
      crack.currentProgress = 1.0;
    } else {
      // Normal progression: each crack becomes visible when its turn comes
      const crackAge = Math.max(0, selectedCount - index);
      crack.currentProgress = Math.min(1.0, Math.max(0.1, crackAge / 3)); // Gradual growth
    }
  });

  squareCracks.lastProgress = globalProgress;
};