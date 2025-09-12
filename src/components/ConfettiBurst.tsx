import { useEffect, useRef, useState } from 'react';

interface ConfettiBurstProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function ConfettiBurst({ trigger, onComplete }: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      startFireworks();
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

  const startFireworks = () => {
    setIsActive(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = [
      '#9333ea', // purple-600 (main brand)
      '#7c3aed', // violet-600
      '#8b5cf6', // violet-500
      '#a855f7', // purple-500
      '#c084fc', // purple-400
      '#d8b4fe', // purple-300
      '#e9d5ff', // purple-200
      '#c026d3', // fuchsia-600
      '#d946ef', // fuchsia-500
      '#e879f9', // fuchsia-400
      '#f0abfc', // fuchsia-300
      '#ec4899', // pink-500
    ];
    let particles: Array<{
      x: number, y: number, vx: number, vy: number, color: string, 
      life: number, size: number, trail: Array<{x: number, y: number, opacity: number}>
    }> = [];

    // Create multiple firework bursts
    const createBurst = (centerX: number, centerY: number, delay: number, burstSize: number = 50) => {
      setTimeout(() => {
        for (let i = 0; i < burstSize; i++) {
          const angle = (Math.PI * 2 * i) / burstSize + (Math.random() - 0.5) * 0.3;
          const speed = Math.random() * 10 + 6; // Increased speed range
          particles.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - Math.random() * 2, // Some upward bias
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 0,
            size: Math.random() * 4 + 2, // Variable particle size
            trail: []
          });
        }
      }, delay);
    };

    // Create 8 bursts with varying sizes and timing - 2x particles!
    createBurst(canvas.width * 0.2, canvas.height * 0.25, 0, 120);
    createBurst(canvas.width * 0.8, canvas.height * 0.2, 400, 160);
    createBurst(canvas.width * 0.5, canvas.height * 0.3, 800, 200);
    createBurst(canvas.width * 0.1, canvas.height * 0.4, 1200, 140);
    createBurst(canvas.width * 0.9, canvas.height * 0.35, 1600, 180);
    createBurst(canvas.width * 0.3, canvas.height * 0.15, 2000, 160);
    createBurst(canvas.width * 0.7, canvas.height * 0.25, 2400, 200);
    createBurst(canvas.width * 0.5, canvas.height * 0.1, 2800, 240); // Epic grand finale

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles = particles.filter(particle => {
        // Update trail
        particle.trail.push({ x: particle.x, y: particle.y, opacity: 1 - particle.life / 240 });
        if (particle.trail.length > 8) particle.trail.shift();

        // Physics
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.15; // gravity
        particle.vx *= 0.995; // air resistance
        particle.life++;

        if (particle.life < 240) { // 4 seconds at 60fps
          // Draw trail as squares
          particle.trail.forEach((point, index) => {
            const trailOpacity = point.opacity * (index / particle.trail.length) * 0.4;
            if (trailOpacity > 0.01) {
              ctx.save();
              ctx.globalAlpha = trailOpacity;
              ctx.fillStyle = particle.color;
              const trailSize = particle.size * 0.3 * (index / particle.trail.length);
              ctx.fillRect(point.x - trailSize/2, point.y - trailSize/2, trailSize, trailSize);
              ctx.restore();
            }
          });

          // Draw main particle as square with glow
          const opacity = Math.max(0, 1 - particle.life / 240);
          ctx.save();
          ctx.globalAlpha = opacity;
          
          // Glow effect
          ctx.shadowBlur = particle.size * 3;
          ctx.shadowColor = particle.color;
          ctx.fillStyle = particle.color;
          
          // Main square particle
          ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
          
          // Inner bright core as smaller square
          ctx.shadowBlur = 0;
          ctx.globalAlpha = opacity * 0.8;
          ctx.fillStyle = '#ffffff';
          const coreSize = particle.size * 0.3;
          ctx.fillRect(particle.x - coreSize/2, particle.y - coreSize/2, coreSize, coreSize);
          
          ctx.restore();
          return true;
        }
        return false;
      });

      if (particles.length > 0) {
        requestAnimationFrame(animate);
      } else {
        setIsActive(false);
        onComplete?.();
      }
    };

    // Start animation immediately and also after first burst
    animate();
    setTimeout(() => animate(), 100);
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