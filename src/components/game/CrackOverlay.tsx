import { useEffect, useRef } from "react";

interface CrackOverlayProps {
  globalProgress: number; // 0-1 based on total checked squares
  squareColor: string; // Original square color
  isVisible: boolean;
  squareId: number; // Unique square ID for stable crack generation
}

interface CrackSegment {
  x: number;
  y: number;
  generation: number; // 0 = main crack, 1 = first branch, etc.
}

interface Crack {
  startX: number;
  startY: number;
  segments: CrackSegment[];
  maxWidth: number;
  currentProgress: number; // 0-1 how much of this crack is revealed
}

// Global crack storage to persist across component re-renders
const globalCrackStorage = new Map<number, { cracks: Crack[], lastProgress: number }>();

export function CrackOverlay({
  globalProgress,
  squareColor,
  isVisible,
  squareId
}: CrackOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Get or initialize cracks for this square
  const getSquareCracks = () => {
    if (!globalCrackStorage.has(squareId)) {
      globalCrackStorage.set(squareId, { cracks: [], lastProgress: 0 });
    }
    return globalCrackStorage.get(squareId)!;
  };

  // Generate a complete crack structure with all potential segments
  const generateFullCrack = (canvas: HTMLCanvasElement, crackIndex: number, totalSquaresSelected: number): Crack => {
    // Use square ID and crack index for deterministic randomness
    const seedBase = squareId * 1000 + crackIndex * 100;
    const random = (offset: number) => {
      const x = Math.sin(seedBase + offset) * 10000;
      return x - Math.floor(x);
    };

    const segments: CrackSegment[] = [];
    const startX = random(0) * canvas.width;
    const startY = random(1) * canvas.height;

    // FINALE: Cracks to all boundaries when 25 squares selected
    if (totalSquaresSelected >= 25) {
      // Create more intensive shattering cracks radiating to all edges and points
      const edges = [
        // Main edges (multiple points per edge)
        { x: 0, y: startY }, // Left edge center
        { x: 0, y: canvas.height * 0.25 }, // Left edge quarter
        { x: 0, y: canvas.height * 0.75 }, // Left edge three-quarters
        { x: canvas.width, y: startY }, // Right edge center
        { x: canvas.width, y: canvas.height * 0.25 }, // Right edge quarter
        { x: canvas.width, y: canvas.height * 0.75 }, // Right edge three-quarters
        { x: startX, y: 0 }, // Top edge center
        { x: canvas.width * 0.25, y: 0 }, // Top edge quarter
        { x: canvas.width * 0.75, y: 0 }, // Top edge three-quarters
        { x: startX, y: canvas.height }, // Bottom edge center
        { x: canvas.width * 0.25, y: canvas.height }, // Bottom edge quarter
        { x: canvas.width * 0.75, y: canvas.height }, // Bottom edge three-quarters
        // Corners
        { x: 0, y: 0 }, // Top-left corner
        { x: canvas.width, y: 0 }, // Top-right corner
        { x: 0, y: canvas.height }, // Bottom-left corner
        { x: canvas.width, y: canvas.height }, // Bottom-right corner
      ];

      edges.forEach((edge, i) => {
        // Add intermediate points for organic crack paths
        const numPoints = 3 + Math.floor(random(i + 50) * 3);
        for (let j = 1; j <= numPoints; j++) {
          const t = j / (numPoints + 1);
          const x = startX + (edge.x - startX) * t + (random(i * 10 + j) - 0.5) * 20;
          const y = startY + (edge.y - startY) * t + (random(i * 10 + j + 100) - 0.5) * 20;
          segments.push({
            x: Math.max(0, Math.min(canvas.width, x)),
            y: Math.max(0, Math.min(canvas.height, y)),
            generation: j
          });
        }
      });
    } else {
      // Normal crack generation for regular progression
      const maxGeneration = Math.min(totalSquaresSelected, 6);

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
          const numBranches = generation <= 2 ? 2 : 1;

          for (let b = 0; b < numBranches; b++) {
            if (random(branchIndex * 100 + generation * 10 + b + 400) > 0.7) continue;

            const subBranchAngle = (random(branchIndex + generation * 50 + b + 500) - 0.5) * Math.PI * 0.9;
            const baseLength = 20 - generation * 2; // Decreasing length
            const subBranchLength = baseLength + random(branchIndex + generation + b + 600) * baseLength * 0.5;

            const subBranchX = branchPoint.x + Math.cos(subBranchAngle) * subBranchLength;
            const subBranchY = branchPoint.y + Math.sin(subBranchAngle) * subBranchLength;

            if (subBranchX >= 0 && subBranchX <= canvas.width && subBranchY >= 0 && subBranchY <= canvas.height) {
              segments.push({ x: subBranchX, y: subBranchY, generation });
            }
          }
        });
      }
    }

    return {
      startX,
      startY,
      segments,
      maxWidth: 1 + random(999) * 2, // Thinner cracks
      currentProgress: 0
    };
  };

  // Add new cracks and update existing ones as progress increases
  const updateCracks = (canvas: HTMLCanvasElement, progress: number) => {
    const squareCracks = getSquareCracks();
    const selectedCount = Math.round(progress * 25); // Convert to actual square count

    // Add new crack for each square selected (every square adds a new crack to ALL boxes)
    const targetCracks = Math.max(1, selectedCount);
    const currentCracks = squareCracks.cracks.length;

    // Only add new cracks if we need more
    if (targetCracks > currentCracks) {
      for (let i = currentCracks; i < targetCracks; i++) {
        const newCrack = generateFullCrack(canvas, i, selectedCount);
        squareCracks.cracks.push(newCrack);
      }
    }

    // Update progress of existing cracks (they grow and branch over time)
    squareCracks.cracks.forEach((crack, index) => {
      // FINALE: Glass shattering effect when 25 squares selected
      if (selectedCount >= 25) {
        crack.currentProgress = 2.0; // Full visibility for finale
      } else {
        // Normal progression: each crack becomes visible when its turn comes
        const crackAge = Math.max(0, selectedCount - index);
        crack.currentProgress = Math.min(1.0, Math.max(0.1, crackAge / 3)); // Gradual growth
      }
    });

    squareCracks.lastProgress = progress;
  };

  const drawCrack = (ctx: CanvasRenderingContext2D, crack: Crack) => {
    if (crack.segments.length === 0 || crack.currentProgress === 0) return;

    const progress = crack.currentProgress;

    // Calculate current width (glass shattering effect)
    const minWidth = 1;
    let currentWidth;

    if (crack.currentProgress >= 2.0) {
      // GLASS SHATTERING: Still thin but visible finale cracks
      currentWidth = minWidth + crack.maxWidth * 1.2; // Slightly thicker finale cracks
    } else {
      // Normal progression
      currentWidth = minWidth + (crack.maxWidth - minWidth) * progress;
    }

    // Draw different generations of segments based on progress
    const drawSegments = (segments: CrackSegment[], generation: number) => {
      if (segments.length === 0) return;

      // Simple finale logic
      if (crack.currentProgress >= 2.0) {
        // FINALE: Show all segments of all generations
        var generationProgress = 1.0;
      } else {
        // Normal: show segments based on crack progress
        var generationProgress = Math.min(1.0, Math.max(0, progress - generation * 0.2));
        if (generationProgress <= 0) return;
      }

      const segmentsToShow = Math.floor(segments.length * generationProgress);

      if (segmentsToShow === 0) return;

      // Width decreases with generation (main crack is thickest)
      const generationWidth = currentWidth / (generation + 1);

      // Draw white outline first
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = generationWidth + 1;
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';

      ctx.beginPath();
      if (generation === 0) {
        // Main crack starts from crack start point
        ctx.moveTo(crack.startX, crack.startY);
        for (let i = 0; i < segmentsToShow && i < segments.length; i++) {
          if (segments[i]) {
            ctx.lineTo(segments[i].x, segments[i].y);
          }
        }
      } else {
        // Branches connect to their parent segments
        const parentSegments = crack.segments.filter(s => s.generation === generation - 1);
        if (parentSegments.length === 0) return; // No parents available

        segments.slice(0, Math.min(segmentsToShow, segments.length)).forEach(segment => {
          // Safety check for segment
          if (!segment || typeof segment.x !== 'number' || typeof segment.y !== 'number') return;

          // Find closest parent segment to branch from
          const parentSegment = parentSegments.reduce((closest, parent) => {
            if (!closest || !parent) return parent || closest;
            if (typeof parent.x !== 'number' || typeof parent.y !== 'number') return closest;

            const distToParent = Math.sqrt((segment.x - parent.x) ** 2 + (segment.y - parent.y) ** 2);
            const distToClosest = Math.sqrt((segment.x - closest.x) ** 2 + (segment.y - closest.y) ** 2);
            return distToParent < distToClosest ? parent : closest;
          }, parentSegments[0]);

          if (parentSegment && typeof parentSegment.x === 'number' && typeof parentSegment.y === 'number') {
            ctx.moveTo(parentSegment.x, parentSegment.y);
            ctx.lineTo(segment.x, segment.y);
          }
        });
      }
      ctx.stroke();

      // Draw colored crack on top
      ctx.strokeStyle = squareColor;
      ctx.lineWidth = generationWidth;

      ctx.beginPath();
      if (generation === 0) {
        ctx.moveTo(crack.startX, crack.startY);
        for (let i = 0; i < segmentsToShow && i < segments.length; i++) {
          if (segments[i]) {
            ctx.lineTo(segments[i].x, segments[i].y);
          }
        }
      } else {
        const parentSegments = crack.segments.filter(s => s.generation === generation - 1);
        if (parentSegments.length === 0) return; // No parents available

        segments.slice(0, Math.min(segmentsToShow, segments.length)).forEach(segment => {
          // Safety check for segment
          if (!segment || typeof segment.x !== 'number' || typeof segment.y !== 'number') return;

          const parentSegment = parentSegments.reduce((closest, parent) => {
            if (!closest || !parent) return parent || closest;
            if (typeof parent.x !== 'number' || typeof parent.y !== 'number') return closest;

            const distToParent = Math.sqrt((segment.x - parent.x) ** 2 + (segment.y - parent.y) ** 2);
            const distToClosest = Math.sqrt((segment.x - closest.x) ** 2 + (segment.y - closest.y) ** 2);
            return distToParent < distToClosest ? parent : closest;
          }, parentSegments[0]);

          if (parentSegment && typeof parentSegment.x === 'number' && typeof parentSegment.y === 'number') {
            ctx.moveTo(parentSegment.x, parentSegment.y);
            ctx.lineTo(segment.x, segment.y);
          }
        });
      }
      ctx.stroke();
    };

    // Draw each generation progressively (now up to 6 generations!)
    for (let gen = 0; gen <= 6; gen++) {
      const generationSegments = crack.segments.filter(s => s.generation === gen);
      drawSegments(generationSegments, gen);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match parent
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const squareCracks = getSquareCracks();

    // Update cracks when progress changes (only adds new ones)
    if (globalProgress > squareCracks.lastProgress) {
      updateCracks(canvas, globalProgress);
    }


    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isVisible && squareCracks.cracks.length > 0) {
        squareCracks.cracks.forEach(crack => {
          drawCrack(ctx, crack);
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [globalProgress, squareColor, isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
    />
  );
}