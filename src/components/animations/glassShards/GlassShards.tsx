import { useEffect, useRef, useState } from 'react';
import { GlassShardsProps, GlassShard } from './types';
import { createGridExplosion, DEFAULT_SHARD_CONFIG } from './generator';
import { updateAllShards, resetExplosionLogging } from './physics';
import { renderAllShards } from './renderer';

export function GlassShards({ trigger, onComplete, boardRect }: GlassShardsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const shardsRef = useRef<GlassShard[]>([]);

  useEffect(() => {
    if (trigger && !isActive) {
      startGlassExplosion();
    }
  }, [trigger, isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startGlassExplosion = () => {
    setIsActive(true);
    resetExplosionLogging();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get board position or use center as fallback
    let explosionRect: DOMRect;
    if (boardRect) {
      explosionRect = boardRect;
    } else {
      // Fallback: center of screen
      explosionRect = new DOMRect(
        window.innerWidth / 2 - 200,
        window.innerHeight / 2 - 200,
        400,
        400
      );
    }

    // Create grid explosion from every square
    shardsRef.current = createGridExplosion(
      explosionRect,
      canvas,
      { cols: 5, rows: 5 }, // 5x5 bingo grid
      DEFAULT_SHARD_CONFIG
    );

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update physics for all shards
      shardsRef.current = updateAllShards(shardsRef.current, DEFAULT_SHARD_CONFIG);

      // Render all shards
      if (shardsRef.current.length > 0) {
        renderAllShards(ctx, shardsRef.current);
        requestAnimationFrame(animate);
      } else {
        // Animation complete
        setIsActive(false);
        onComplete?.();
      }
    };

    // Start the animation
    animate();
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        background: 'transparent',
        zIndex: 9999,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'
      }}
    />
  );
}