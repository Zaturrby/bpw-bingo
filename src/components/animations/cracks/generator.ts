import { Crack, CrackSegment } from './types';

export const generateFullCrack = (
  canvas: HTMLCanvasElement,
  crackIndex: number,
  totalSquaresSelected: number,
  squareId: number
): Crack => {
  // Use square ID and crack index for deterministic randomness
  const seedBase = squareId * 1000 + crackIndex * 100;
  const random = (offset: number) => {
    const x = Math.sin(seedBase + offset) * 10000;
    return x - Math.floor(x);
  };

  const segments: CrackSegment[] = [];
  const startX = random(0) * canvas.width;
  const startY = random(1) * canvas.height;

  // Enhanced crack generation - more dramatic for final selections
  const maxGeneration = Math.min(totalSquaresSelected, totalSquaresSelected >= 22 ? 10 : 6);

  // Generate main crack line (generation 0)
  let currentX = startX;
  let currentY = startY;
  const mainSegments = 2 + Math.floor(random(2) * 2);

  for (let i = 0; i < mainSegments; i++) {
    const angle = (random(i + 10) - 0.5) * Math.PI * 1.2;
    const length = 15 + random(i + 20) * 25;

    currentX += Math.cos(angle) * length;
    currentY += Math.sin(angle) * length;

    currentX = Math.max(5, Math.min(canvas.width - 5, currentX));
    currentY = Math.max(5, Math.min(canvas.height - 5, currentY));

    segments.push({ x: currentX, y: currentY, generation: 0 });
  }

  // Generate additional generations based on squares selected
  for (let generation = 1; generation <= maxGeneration; generation++) {
    const parentBranches = segments.filter(s => s.generation === generation - 1);
    if (parentBranches.length === 0) continue;

    parentBranches.forEach((branchPoint, branchIndex) => {
      // More branches for final selections
      const isFinaleMode = totalSquaresSelected >= 23;
      const numBranches = isFinaleMode
        ? (generation <= 3 ? 3 : 2) // More branches in finale
        : (generation <= 2 ? 2 : 1); // Normal progression

      for (let b = 0; b < numBranches; b++) {
        // Higher probability of branching in finale mode
        const branchProbability = isFinaleMode ? 0.5 : 0.7;
        if (random(branchIndex * 100 + generation * 10 + b + 400) > branchProbability) continue;

        const subBranchAngle = (random(branchIndex + generation * 50 + b + 500) - 0.5) * Math.PI * 0.9;
        const baseLength = 20 - generation * (isFinaleMode ? 1 : 2); // Longer cracks in finale
        const subBranchLength = baseLength + random(branchIndex + generation + b + 600) * baseLength * 0.5;

        const subBranchX = branchPoint.x + Math.cos(subBranchAngle) * subBranchLength;
        const subBranchY = branchPoint.y + Math.sin(subBranchAngle) * subBranchLength;

        if (subBranchX >= 0 && subBranchX <= canvas.width && subBranchY >= 0 && subBranchY <= canvas.height) {
          segments.push({ x: subBranchX, y: subBranchY, generation });
        }
      }
    });
  }

  return {
    startX,
    startY,
    segments,
    maxWidth: 1 + random(999) * 2, // Thinner cracks
    currentProgress: 0
  };
};