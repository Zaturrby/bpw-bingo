import { Crack, CrackSegment } from './types';

export const drawCrack = (
  ctx: CanvasRenderingContext2D,
  crack: Crack,
  squareColor: string
) => {
  if (crack.segments.length === 0 || crack.currentProgress === 0) return;

  const progress = crack.currentProgress;

  // Calculate current width
  const minWidth = 1;
  const currentWidth = minWidth + (crack.maxWidth - minWidth) * progress;

  // Draw different generations of segments based on progress
  const drawSegments = (segments: CrackSegment[], generation: number) => {
    if (segments.length === 0) return;

    // Show segments based on crack progress
    const generationProgress = Math.min(1.0, Math.max(0, progress - generation * 0.2));
    if (generationProgress <= 0) return;

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

  // Draw each generation progressively (up to 10 generations for finale!)
  for (let gen = 0; gen <= 10; gen++) {
    const generationSegments = crack.segments.filter(s => s.generation === gen);
    drawSegments(generationSegments, gen);
  }
};