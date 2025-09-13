export interface Activist {
  x: number;
  speed: number;
  color: string;
  signText: string;
  bodyHeight: number;
  wobbleOffset: number;
  unrulyLevel: number;
  originalSpeed: number;
  targetSpeed: number;
  isJoining: boolean;
  hasJoined: boolean;
  targetY: number;
  handshakeStage: "none" | "approaching" | "handshaking" | "celebrating" | "marching";
  handshakeTimer: number;
  handshakePartner: number | null;
  willJoinGroup: boolean;
  groupPosition: number;
}

export interface HandshakeBubble {
  x: number;
  y: number;
  life: number;
  opacity: number;
}

export type AnimationContext = CanvasRenderingContext2D;
export type AnimationCanvas = HTMLCanvasElement;