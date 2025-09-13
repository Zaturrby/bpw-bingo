import { useEffect, useRef } from "react";
import { CrackOverlayProps } from "./types";
import { getSquareCracks } from "./storage";
import { updateCracks } from "./updater";
import { drawCrack } from "./renderer";
import { detectAndHandlePageReload } from "./utils";
import { shouldTriggerFinale, DEFAULT_FINALE_CONFIG } from "./finale";

export function CrackOverlay({
  globalProgress,
  squareColor,
  isVisible,
  squareId
}: CrackOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

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

    // Handle potential page reload scenario
    detectAndHandlePageReload(globalProgress, squareId);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update cracks on every frame (for finale animation)
      const squareCracks = getSquareCracks(squareId);
      const selectedCount = Math.round(globalProgress * 25);
      const shouldUpdate = globalProgress > squareCracks.lastProgress ||
                          shouldTriggerFinale(selectedCount, DEFAULT_FINALE_CONFIG);

      if (shouldUpdate) {
        updateCracks(canvas, globalProgress, squareId);
      }

      // Draw cracks
      if (isVisible && squareCracks.cracks.length > 0) {
        squareCracks.cracks.forEach(crack => {
          drawCrack(ctx, crack, squareColor);
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
  }, [globalProgress, squareColor, isVisible, squareId]);

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