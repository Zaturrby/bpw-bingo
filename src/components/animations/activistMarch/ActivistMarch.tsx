import { useEffect, useRef } from "react";
import { Activist, HandshakeBubble } from './types';
import { ANIMATION_CONFIG, INITIAL_ACTIVISTS } from './config';
import { ActivistRenderer } from './activistRenderer';
import { HandshakeSystem } from './handshakeSystem';
import { GroupFormation } from './groupFormation';

export function ActivistMarch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = ANIMATION_CONFIG.CANVAS_HEIGHT;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize activists with default handshake states
    const activists: Activist[] = INITIAL_ACTIVISTS.map(activist => ({
      ...activist,
      isJoining: false,
      hasJoined: false,
      handshakeStage: "none" as const,
      handshakeTimer: 0,
      handshakePartner: null,
    }));

    // Track handshake bubbles
    const handshakeBubbles: HandshakeBubble[] = [];

    // Initialize systems
    const renderer = new ActivistRenderer(ctx, canvas);
    const handshakeSystem = new HandshakeSystem(canvas);
    const groupFormation = new GroupFormation(canvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw light purple ground strip underneath their feet
      ctx.fillStyle = ANIMATION_CONFIG.GROUND_COLOR;
      ctx.fillRect(0, canvas.height - ANIMATION_CONFIG.GROUND_HEIGHT, canvas.width, ANIMATION_CONFIG.GROUND_HEIGHT);

      // Update handshake bubbles
      handshakeSystem.updateHandshakeBubbles(handshakeBubbles);

      // Update handshake logic
      handshakeSystem.updateHandshakeLogic(activists, handshakeBubbles);

      // Update group formation and movement
      groupFormation.updateGroupFormation(activists);

      // Draw each activist
      activists.forEach((activist) => {
        // Calculate current y position with smooth transition
        let currentY = 0;
        if (activist.hasJoined && activist.targetY !== undefined) {
          // Gradually transition to target Y position during celebrating and marching phases
          if (activist.handshakeStage === "celebrating" || activist.handshakeStage === "marching") {
            // Smooth transition over time
            const transitionProgress = Math.min(activist.handshakeTimer / 60, 1); // 1 second transition
            currentY = activist.targetY * transitionProgress;
          }
          // During handshaking, maintain ground level (currentY = 0)
        }

        renderer.drawActivist(
          activist.x,
          currentY,
          activist.color,
          activist.signText,
          activist.bodyHeight,
          activist.wobbleOffset,
          activist.unrulyLevel
        );
      });

      // Draw handshake bubbles
      handshakeBubbles.forEach((bubble) => {
        ctx.save();
        ctx.globalAlpha = bubble.opacity;
        ctx.font = "32px Arial"; // Bigger handshake emoji
        ctx.textAlign = "center";
        ctx.fillText("🤝", bubble.x, bubble.y);
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full pointer-events-none relative overflow-hidden" style={{ height: "200px" }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          background: "transparent",
          width: "100%",
          height: "200px",
        }}
      />
    </div>
  );
}