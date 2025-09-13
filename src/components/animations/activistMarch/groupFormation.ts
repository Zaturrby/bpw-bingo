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
    // Find the front of the group (activist with smallest groupPosition who is marching)
    const marchingActivists = activists.filter((a) => a.hasJoined && a.handshakeStage === "marching");

    if (marchingActivists.length > 0) {
      const groupLeader = marchingActivists.reduce((leader, current) =>
        current.groupPosition < leader.groupPosition ? current : leader
      );

      const targetX = groupLeader.x - activist.groupPosition * ANIMATION_CONFIG.GROUP_SPACING;
      const distanceToTarget = targetX - activist.x;

      // Gentler speed adjustment with better spacing maintenance
      if (Math.abs(distanceToTarget) > ANIMATION_CONFIG.POSITION_TOLERANCE) {
        // Only adjust if moderately out of position
        if (distanceToTarget > 0) {
          activist.speed = ANIMATION_CONFIG.CATCH_UP_SPEED; // Speed up slightly to catch up
        } else {
          activist.speed = ANIMATION_CONFIG.SLOW_DOWN_SPEED; // Slow down slightly to let others catch up
        }
      } else {
        activist.speed = ANIMATION_CONFIG.GROUP_SPEED; // Group speed
      }
    } else {
      activist.speed = ANIMATION_CONFIG.GROUP_SPEED; // Default group speed
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
    // If they've joined the group, keep them in formation when they loop back
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