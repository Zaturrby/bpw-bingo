import { Activist, HandshakeBubble, AnimationCanvas } from './types';
import { ANIMATION_CONFIG } from './config';

export class HandshakeSystem {
  private canvas: AnimationCanvas;

  constructor(canvas: AnimationCanvas) {
    this.canvas = canvas;
  }

  updateHandshakeLogic(activists: Activist[], handshakeBubbles: HandshakeBubble[]): void {
    activists.forEach((activist, index) => {
      // Handle handshake stages
      if (activist.handshakeStage !== "none") {
        activist.handshakeTimer++;
      }

      // Look for nearby activists to handshake with
      this.checkForHandshakeOpportunities(activist, index, activists);

      // Update movement and stage based on current handshake stage
      this.updateHandshakeStages(activist, activists, handshakeBubbles);
    });
  }

  private checkForHandshakeOpportunities(
    activist: Activist,
    index: number,
    activists: Activist[]
  ): void {
    if (
      activist.handshakeStage === "none" &&
      !activist.hasJoined &&
      activist.willJoinGroup
    ) {
      activists.forEach((otherActivist, otherIndex) => {
        if (
          otherIndex !== index &&
          Math.abs(activist.x - otherActivist.x) < ANIMATION_CONFIG.HANDSHAKE_DETECTION_DISTANCE &&
          otherActivist.handshakeStage === "none" &&
          !otherActivist.hasJoined &&
          otherActivist.willJoinGroup &&
          activist.x > this.canvas.width * ANIMATION_CONFIG.SCREEN_VISIBILITY_THRESHOLD
        ) {
          // Initiate handshake
          console.log(
            `🤝 Activists ${index} (${activist.signText}) and ${otherIndex} (${otherActivist.signText}) starting handshake at x: ${activist.x}, ${otherActivist.x}`
          );
          this.initiateHandshake(activist, otherActivist, index, otherIndex);
        }
      });
    }
  }

  private initiateHandshake(
    activist1: Activist,
    activist2: Activist,
    index1: number,
    index2: number
  ): void {
    activist1.handshakeStage = "approaching";
    activist2.handshakeStage = "approaching";
    activist1.handshakePartner = index2;
    activist2.handshakePartner = index1;
    activist1.handshakeTimer = 0;
    activist2.handshakeTimer = 0;
  }

  private updateHandshakeStages(
    activist: Activist,
    activists: Activist[],
    handshakeBubbles: HandshakeBubble[]
  ): void {
    switch (activist.handshakeStage) {
      case "approaching":
        this.handleApproaching(activist, activists);
        break;
      case "handshaking":
        this.handleHandshaking(activist, activists, handshakeBubbles);
        break;
      case "celebrating":
        this.handleCelebrating(activist);
        break;
    }
  }

  private handleApproaching(activist: Activist, activists: Activist[]): void {
    if (activist.handshakePartner === null) return;

    const partner = activists[activist.handshakePartner];
    const distance = Math.abs(activist.x - partner.x);

    // Speed up to approach partner
    if (activist.x < partner.x) {
      activist.speed = Math.max(activist.speed, ANIMATION_CONFIG.APPROACH_FAST_SPEED);
    } else {
      activist.speed = Math.min(activist.speed, ANIMATION_CONFIG.APPROACH_SLOW_SPEED);
    }

    // Start handshaking when close
    if (distance < ANIMATION_CONFIG.HANDSHAKE_COMPLETION_DISTANCE &&
        activist.handshakeTimer > ANIMATION_CONFIG.HANDSHAKE_APPROACH_TIME) {
      console.log(
        `🤝 Activists ${activists.indexOf(activist)} and ${activist.handshakePartner} now handshaking (distance: ${distance})`
      );
      activist.handshakeStage = "handshaking";
      partner.handshakeStage = "handshaking";
      activist.speed = 0; // Stop during handshake
      partner.speed = 0;
      activist.handshakeTimer = 0;
      partner.handshakeTimer = 0;
    }
  }

  private handleHandshaking(
    activist: Activist,
    activists: Activist[],
    handshakeBubbles: HandshakeBubble[]
  ): void {
    // During handshake, stay still
    activist.speed = 0;

    // Create handshake bubble after a moment
    if (activist.handshakeTimer === ANIMATION_CONFIG.BUBBLE_TRIGGER_FRAME) {
      const partner = activists[activist.handshakePartner!];
      const midX = (activist.x + partner.x) / 2;
      const midY = this.canvas.height + ANIMATION_CONFIG.HANDSHAKE_BUBBLE_START_Y;
      handshakeBubbles.push({
        x: midX,
        y: midY,
        life: 0,
        opacity: 1,
      });
    }

    // Finish handshake and join group
    if (activist.handshakeTimer > ANIMATION_CONFIG.HANDSHAKE_DURATION) {
      console.log(
        `✅ Activists ${activists.indexOf(activist)} and ${activist.handshakePartner} completed handshake and joined group!`
      );

      this.completeHandshake(activist, activists);
    }
  }

  private completeHandshake(activist: Activist, activists: Activist[]): void {
    // Assign group positions if they don't have them yet
    const joinedCount = activists.filter((a) => a.hasJoined).length;
    if (activist.groupPosition === -1) {
      activist.groupPosition = joinedCount;
    }

    activist.handshakeStage = "celebrating";
    activist.speed = 0; // Stand still for celebration
    activist.unrulyLevel = 0.3; // Calmer
    activist.hasJoined = true;
    activist.handshakeTimer = 0; // Reset timer for celebration phase

    const partner = activists[activist.handshakePartner!];
    if (partner.handshakeStage === "handshaking") {
      if (partner.groupPosition === -1) {
        partner.groupPosition = joinedCount + 1;
      }

      partner.handshakeStage = "celebrating";
      partner.speed = 0; // Stand still for celebration
      partner.unrulyLevel = 0.3;
      partner.hasJoined = true;
      partner.handshakeTimer = 0; // Reset timer for celebration phase
    }
  }

  private handleCelebrating(activist: Activist): void {
    activist.speed = 0; // Stand still

    // After celebrating, start marching with the group
    if (activist.handshakeTimer > ANIMATION_CONFIG.HANDSHAKE_CELEBRATION_TIME) {
      activist.handshakeStage = "marching";
      activist.speed = ANIMATION_CONFIG.GROUP_SPEED;
    }
  }

  updateHandshakeBubbles(handshakeBubbles: HandshakeBubble[]): void {
    handshakeBubbles.forEach((bubble, index) => {
      bubble.life++;
      bubble.y -= ANIMATION_CONFIG.BUBBLE_FLOAT_SPEED; // Float upward slower
      bubble.opacity = Math.max(0, 1 - bubble.life / ANIMATION_CONFIG.BUBBLE_LIFE_DURATION);

      if (bubble.life > ANIMATION_CONFIG.BUBBLE_LIFE_DURATION) {
        handshakeBubbles.splice(index, 1);
      }
    });
  }
}