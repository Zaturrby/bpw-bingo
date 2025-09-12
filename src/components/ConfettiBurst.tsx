import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  gravity: number;
  fadeStart: number;
  opacity: number;
  trail: { x: number; y: number; opacity: number }[];
}

interface FireworkBurst {
  id: number;
  x: number;
  y: number;
  startTime: number;
  particles: ConfettiPiece[];
}

interface ConfettiBurstProps {
  trigger: boolean;
  onComplete?: () => void;
}

const CONFETTI_COLORS = [
  '#9333ea', // purple-600 (main brand)
  '#7c3aed', // violet-600
  '#c026d3', // fuchsia-600
  '#ec4899', // pink-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#22c55e', // green-500
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#f59e0b', // amber-500
];

export function ConfettiBurst({ trigger, onComplete }: ConfettiBurstProps) {
  const [fireworks, setFireworks] = useState<FireworkBurst[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      startFireworks();
    }
  }, [trigger, isActive]);

  const createFireworkBurst = (x: number, y: number, burstId: number, startTime: number): FireworkBurst => {
    const particles: ConfettiPiece[] = [];
    const particleCount = 25; // Particles per firework
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 8 + 6; // Speed between 6-14
      
      particles.push({
        id: i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: Math.random() * 6 + 3, // Size between 3-9px
        gravity: 0.15,
        fadeStart: startTime + 3000, // Start fading after 3 seconds
        opacity: 1,
        trail: [],
      });
    }
    
    return {
      id: burstId,
      x,
      y,
      startTime,
      particles,
    };
  };

  const startFireworks = () => {
    setIsActive(true);
    
    const bursts: FireworkBurst[] = [];
    const startTime = Date.now();
    
    // Create multiple firework bursts at different times and positions
    const burstCount = 6;
    for (let i = 0; i < burstCount; i++) {
      const delay = i * 400; // 400ms between each burst
      const x = Math.random() * window.innerWidth * 0.6 + window.innerWidth * 0.2; // Center area
      const y = Math.random() * window.innerHeight * 0.4 + window.innerHeight * 0.1; // Upper area
      
      setTimeout(() => {
        setFireworks(prev => [...prev, createFireworkBurst(x, y, i, Date.now())]);
      }, delay);
    }

    // Animate all fireworks
    const animationDuration = 7000; // 7 seconds total
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      if (elapsed >= animationDuration) {
        setFireworks([]);
        setIsActive(false);
        onComplete?.();
        return;
      }

      setFireworks(prevFireworks => 
        prevFireworks.map(firework => ({
          ...firework,
          particles: firework.particles.map(particle => {
            // Update trail
            const newTrail = [...particle.trail, { x: particle.x, y: particle.y, opacity: particle.opacity * 0.7 }];
            if (newTrail.length > 8) newTrail.shift(); // Keep only last 8 trail points

            // Calculate fade
            const particleAge = currentTime - firework.startTime;
            let opacity = 1;
            if (particleAge > 2000) { // Start fading after 2 seconds
              opacity = Math.max(0, 1 - (particleAge - 2000) / 3000);
            }

            return {
              ...particle,
              x: particle.x + particle.vx,
              y: particle.y + particle.vy,
              vx: particle.vx * 0.98, // Air resistance
              vy: particle.vy + particle.gravity,
              rotation: particle.rotation + particle.rotationSpeed,
              opacity,
              trail: newTrail,
            };
          }).filter(particle => 
            particle.opacity > 0.01 &&
            particle.y < window.innerHeight + 100 && 
            particle.x > -100 && particle.x < window.innerWidth + 100
          )
        })).filter(firework => firework.particles.length > 0)
      );

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  if (!isActive || fireworks.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {fireworks.map(firework =>
        firework.particles.map(particle => (
          <div key={`${firework.id}-${particle.id}`}>
            {/* Render particle trail */}
            {particle.trail.map((trailPoint, trailIndex) => (
              <div
                key={`trail-${firework.id}-${particle.id}-${trailIndex}`}
                className="absolute"
                style={{
                  left: `${trailPoint.x}px`,
                  top: `${trailPoint.y}px`,
                  width: `${particle.size * 0.5}px`,
                  height: `${particle.size * 0.5}px`,
                  backgroundColor: particle.color,
                  opacity: trailPoint.opacity * 0.6,
                  borderRadius: '50%',
                  transform: `scale(${0.3 + (trailIndex / particle.trail.length) * 0.7})`,
                }}
              />
            ))}
            
            {/* Render main particle */}
            <div
              className="absolute"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                opacity: particle.opacity,
                transform: `rotate(${particle.rotation}deg)`,
                borderRadius: Math.random() > 0.6 ? '50%' : '0%',
                boxShadow: `0 0 ${particle.size}px ${particle.color}40`,
              }}
            />
          </div>
        ))
      )}
    </div>
  );
}