import { Activist, AnimationCanvas } from './types';
import { ANIMATION_CONFIG } from './config';

export class GroupFormation {
  private canvas: AnimationCanvas;

  constructor(canvas: AnimationCanvas) {
    this.canvas = canvas;
  }

  updateGroupFormation(activists: Activist[]): void {
    activists.forEach((activist) => {
      if (activist.hasJoined && activist.groupPosition >= 0 && activist.handshakeStage === "marching") {
        this.maintainGroupPosition(activist, activists);
      }

      this.updateMovement(activist);
      this.handleScreenReset(activist);
    });
  }

  private maintainGroupPosition(activist: Activist, activists: Activist[]): void {
    // Find the group leader to maintain relative positions
    const marchingActivists = activists.filter((a) => a.hasJoined && a.handshakeStage === "marching");

    if (marchingActivists.length === 0) {
      activist.speed = ANIMATION_CONFIG.GROUP_SPEED;
      return;
    }

    // Prefer housing activists as group leader, otherwise use lowest position
    const housingLeaders = marchingActivists.filter(a =>
      a.signText === "🏘️" || a.signText === "🔑" || a.signText === "🏚️" ||
      a.signText === "🏡" || a.signText === "🏢" || a.signText === "🛡️"
    );

    const groupLeader = housingLeaders.length > 0
      ? housingLeaders.reduce((leader, current) =>
          current.groupPosition < leader.groupPosition ? current : leader
        )
      : marchingActivists.reduce((leader, current) =>
          current.groupPosition < leader.groupPosition ? current : leader
        );

    // Calculate where this activist should be relative to leader
    const targetX = groupLeader.x - activist.groupPosition * ANIMATION_CONFIG.GROUP_SPACING;
    const distanceError = targetX - activist.x;

    // Simple correction: only adjust speed if significantly out of position
    if (Math.abs(distanceError) > ANIMATION_CONFIG.GROUP_SPACING * 0.3) {
      // Gentle correction - max 0.05 speed adjustment
      const correction = Math.sign(distanceError) * Math.min(Math.abs(distanceError) / ANIMATION_CONFIG.GROUP_SPACING, 0.05);
      activist.speed = ANIMATION_CONFIG.GROUP_SPEED + correction;
    } else {
      // In good position - maintain group speed with slight natural variation
      const naturalVariation = Math.sin(Date.now() * 0.001 + activist.wobbleOffset) * 0.01;
      activist.speed = ANIMATION_CONFIG.GROUP_SPEED + naturalVariation;
    }
  }

  private updateMovement(activist: Activist): void {
    // Normal movement for activists
    if (
      activist.handshakeStage === "none" ||
      activist.handshakeStage === "marching" ||
      activist.handshakeStage === "approaching"
    ) {
      activist.x += activist.speed;
    }
    // Note: handshaking and celebrating activists don't move (speed = 0)
  }

  private handleScreenReset(activist: Activist): void {
    // Reset position when off-screen
    if (activist.x > this.canvas.width + 100) {
      this.resetActivistPosition(activist);
      this.resetHandshakeState(activist);
    }
  }

  private resetActivistPosition(activist: Activist): void {
    // If they've joined the group, keep them in fixed formation when they loop back
    if (activist.hasJoined) {
      activist.x = ANIMATION_CONFIG.RESET_POSITION_OFFSET - activist.groupPosition * ANIMATION_CONFIG.GROUP_SPACING;
      activist.speed = ANIMATION_CONFIG.GROUP_SPEED;
      activist.unrulyLevel = 0.3; // Stay calm
      activist.handshakeStage = "marching"; // Start marching immediately
    } else {
      // Reset to original state if not joined
      activist.x = ANIMATION_CONFIG.RESET_POSITION_OFFSET - Math.random() * ANIMATION_CONFIG.RESET_RANDOM_RANGE;
      activist.speed = activist.originalSpeed;
      // Reset unrulyLevel based on original configuration
      activist.unrulyLevel = this.getOriginalUnrulyLevel(activist);
      activist.handshakeStage = "none";
    }
  }

  private getOriginalUnrulyLevel(activist: Activist): number {
    // This is a simplified version - in a real implementation, you might want to store the original unrulyLevel
    // For now, we'll use some reasonable defaults based on the activist's characteristics
    if (activist.signText === "♀️" || activist.signText === "🌱") {
      return 1.1;
    } else if (activist.signText === "🏚️" || activist.signText === "🏢") {
      return 1.0;
    } else if (activist.signText === "☮️" || activist.signText === "🤝") {
      return 0.7;
    } else {
      return 0.6;
    }
  }

  private resetHandshakeState(activist: Activist): void {
    // Always reset handshake interaction states
    activist.handshakeTimer = 0;
    activist.handshakePartner = null;
  }
}