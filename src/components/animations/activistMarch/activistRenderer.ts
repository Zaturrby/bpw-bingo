import { AnimationContext, AnimationCanvas } from './types';

export class ActivistRenderer {
  private ctx: AnimationContext;
  private canvas: AnimationCanvas;

  constructor(ctx: AnimationContext, canvas: AnimationCanvas) {
    this.ctx = ctx;
    this.canvas = canvas;
  }

  drawActivist(
    x: number,
    y: number,
    color: string,
    signText: string,
    bodyHeight: number,
    wobbleOffset: number,
    unrulyLevel: number
  ): void {
    const baseY = this.canvas.height - 20 + y;
    const time = Date.now() * 0.01;
    const walkCycle = Math.sin(time + x * 0.01) * 2 * unrulyLevel;
    const bodyBob = Math.sin(time * 0.8 + wobbleOffset) * 1.5 * unrulyLevel;
    const headTilt = Math.sin(time * 0.6 + wobbleOffset) * 0.1 * unrulyLevel;

    this.ctx.fillStyle = color;

    // Head (square, slightly tilted and bobbing)
    this.drawHead(x, baseY, bodyHeight, headTilt, bodyBob);

    // Body (rectangle, bobbing)
    this.drawBody(x, baseY, bodyHeight, bodyBob);

    // Arms (rectangles, one holding sign stick)
    this.drawArms(x, baseY, bodyHeight, wobbleOffset, unrulyLevel, bodyBob, color, signText);

    // Legs (rectangles with walking animation and more chaos)
    this.drawLegs(x, baseY, wobbleOffset, unrulyLevel, walkCycle, bodyBob);
  }

  private drawHead(
    x: number,
    baseY: number,
    bodyHeight: number,
    headTilt: number,
    bodyBob: number
  ): void {
    const headSize = 12;
    this.ctx.save();
    this.ctx.translate(x, baseY - bodyHeight - headSize - 8 + bodyBob);
    this.ctx.rotate(headTilt);
    this.ctx.fillRect(-headSize / 2, 0, headSize, headSize);
    this.ctx.restore();
  }

  private drawBody(
    x: number,
    baseY: number,
    bodyHeight: number,
    bodyBob: number
  ): void {
    const bodyWidth = 8;
    this.ctx.fillRect(
      x - bodyWidth / 2,
      baseY - bodyHeight + bodyBob,
      bodyWidth,
      bodyHeight - 5
    );
  }

  private drawArms(
    x: number,
    baseY: number,
    bodyHeight: number,
    wobbleOffset: number,
    unrulyLevel: number,
    bodyBob: number,
    color: string,
    signText: string
  ): void {
    const time = Date.now() * 0.01;
    const bodyWidth = 8;
    const armWidth = 4;
    const armLength = 12;
    const armSwing = Math.sin(time * 1.2 + wobbleOffset) * 3 * unrulyLevel;

    // Left arm (swinging freely)
    this.ctx.save();
    this.ctx.translate(x - bodyWidth / 2, baseY - bodyHeight + 5 + bodyBob);
    this.ctx.rotate(armSwing * 0.3);
    this.ctx.fillRect(-armLength, 0, armLength, armWidth);
    this.ctx.restore();

    // Right arm (holding sign stick, less swing)
    const rightArmAngle = armSwing * 0.1; // Much less swing when holding stick
    this.ctx.save();
    this.ctx.translate(x + bodyWidth / 2, baseY - bodyHeight + 5 + bodyBob);
    this.ctx.rotate(rightArmAngle);
    this.ctx.fillRect(0, 0, armLength, armWidth);
    this.ctx.restore();

    // Draw the protest sign
    this.drawProtestSign(x, baseY, bodyHeight, bodyBob, wobbleOffset, unrulyLevel, rightArmAngle, color, signText);
  }

  private drawLegs(
    x: number,
    baseY: number,
    wobbleOffset: number,
    unrulyLevel: number,
    walkCycle: number,
    bodyBob: number
  ): void {
    const time = Date.now() * 0.01;
    const bodyWidth = 8;
    const legWidth = 4;
    const legLength = 13;
    const legKick = Math.sin(time * 1.5 + wobbleOffset) * 1 * unrulyLevel;

    // Left leg
    this.ctx.fillRect(
      x - bodyWidth / 4 - legWidth / 2 + walkCycle + legKick,
      baseY - 5 + bodyBob,
      legWidth,
      legLength
    );
    // Right leg
    this.ctx.fillRect(
      x + bodyWidth / 4 - legWidth / 2 - walkCycle - legKick,
      baseY - 5 + bodyBob,
      legWidth,
      legLength
    );
  }

  private drawProtestSign(
    x: number,
    baseY: number,
    bodyHeight: number,
    bodyBob: number,
    wobbleOffset: number,
    unrulyLevel: number,
    rightArmAngle: number,
    color: string,
    signText: string
  ): void {
    const time = Date.now() * 0.01;
    const bodyWidth = 8;
    const armLength = 12;
    const signWobble = Math.sin(time * 2 + wobbleOffset) * 0.15 * unrulyLevel;
    const signBob = Math.sin(time * 1.5 + wobbleOffset + 0.5) * 3 * unrulyLevel;
    const stickTilt = rightArmAngle + Math.sin(time * 1.8 + wobbleOffset) * 0.1 * unrulyLevel;

    const poleHeight = 40;
    const signWidth = 35;
    const signHeight = 25;

    // Sign pole held in right hand
    this.ctx.strokeStyle = "#666";
    this.ctx.lineWidth = 3;
    this.ctx.save();

    // Start from the end of the right arm
    this.ctx.translate(
      x + bodyWidth / 2 + armLength,
      baseY - bodyHeight + 5 + bodyBob
    );
    this.ctx.rotate(stickTilt);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0, -poleHeight + signBob);
    this.ctx.stroke();

    // Sign at top of pole
    this.ctx.translate(0, -poleHeight + signBob);
    this.ctx.rotate(signWobble);

    // Sign background
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(-signWidth / 2, -signHeight, signWidth, signHeight);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(-signWidth / 2, -signHeight, signWidth, signHeight);

    // Sign text/emoji
    this.ctx.fillStyle = color;
    this.ctx.font = "16px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(signText, 0, -signHeight / 2 + 5);

    this.ctx.restore();
  }
}