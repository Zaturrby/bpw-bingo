import { Activist } from "./types";

// Animation constants
export const ANIMATION_CONFIG = {
  CANVAS_HEIGHT: 140, // Increased height for more bubble space
  GROUND_HEIGHT: 30,
  GROUND_COLOR: "#faf5ff", // purple-50 to match the OrganiseBlock background

  // Handshake settings
  HANDSHAKE_DETECTION_DISTANCE: 60,
  HANDSHAKE_COMPLETION_DISTANCE: 35, // Increased to prevent overlapping during approach
  HANDSHAKE_APPROACH_TIME: 30,
  HANDSHAKE_DURATION: 90,
  HANDSHAKE_CELEBRATION_TIME: 120,
  HANDSHAKE_BUBBLE_START_Y: -100, // Higher starting position

  // Movement settings
  GROUP_SPACING: 10, // Much tighter spacing for synchronized marching
  GROUP_SPEED: 0.6,
  POSITION_TOLERANCE: 8, // Very tight tolerance for precise formation
  CATCH_UP_SPEED: 0.62, // Minimal speed adjustments
  SLOW_DOWN_SPEED: 0.58,
  APPROACH_FAST_SPEED: 0.75, // Reduced approach speeds to prevent overlapping
  APPROACH_SLOW_SPEED: 0.35,

  // Visual settings
  SCREEN_VISIBILITY_THRESHOLD: 0.2, // 20% of screen width before handshakes start
  RESET_POSITION_OFFSET: -150,
  RESET_RANDOM_RANGE: 200,

  // Bubble animation
  BUBBLE_LIFE_DURATION: 180, // Longer duration for slower bubbles
  BUBBLE_FLOAT_SPEED: 0.3, // Even slower float speed
  BUBBLE_TRIGGER_FRAME: 45,
} as const;

// Define the initial activist configuration
export const INITIAL_ACTIVISTS: Omit<
  Activist,
  | "isJoining"
  | "hasJoined"
  | "handshakeStage"
  | "handshakeTimer"
  | "handshakePartner"
>[] = [
  // Solo activists - most will join, but one stays independent
  {
    x: -150,
    speed: 0.5,
    color: "#9333ea",
    signText: "🏠",
    bodyHeight: 25,
    wobbleOffset: 0,
    unrulyLevel: 0.5,
    originalSpeed: 0.5,
    targetSpeed: 0.6,
    targetY: 0,
    willJoinGroup: false, // This housing activist stays independent
    groupPosition: -1,
  },
  {
    x: -350,
    speed: 0.3,
    color: "#ec4899",
    signText: "♀️",
    bodyHeight: 27,
    wobbleOffset: 1,
    unrulyLevel: 0.8,
    originalSpeed: 0.3,
    targetSpeed: 0.6,
    targetY: 0,
    willJoinGroup: true,
    groupPosition: -1,
  },
  {
    x: -550,
    speed: 0.7,
    color: "#7c3aed",
    signText: "☮️",
    bodyHeight: 26,
    wobbleOffset: 2,
    unrulyLevel: 0.6,
    originalSpeed: 0.7,
    targetSpeed: 0.6,
    targetY: 0,
    willJoinGroup: true,
    groupPosition: -1,
  },
  {
    x: -750,
    speed: 0.4,
    color: "#8b5cf6",
    signText: "🌱",
    bodyHeight: 28,
    wobbleOffset: 3,
    unrulyLevel: 1.1,
    originalSpeed: 0.4,
    targetSpeed: 0.6,
    targetY: 0,
    willJoinGroup: true,
    groupPosition: -1,
  },
  {
    x: -950,
    speed: 0.6,
    color: "#c026d3",
    signText: "🤝",
    bodyHeight: 24,
    wobbleOffset: 4,
    unrulyLevel: 0.7,
    originalSpeed: 0.6,
    targetSpeed: 0.6,
    targetY: 0,
    willJoinGroup: true,
    groupPosition: -1,
  },
  // Group activists (6 - housing focused) - all join through handshakes
  {
    x: -1200,
    speed: 0.5,
    color: "#a855f7",
    signText: "🏘️",
    bodyHeight: 29,
    wobbleOffset: 5,
    unrulyLevel: 0.8,
    originalSpeed: 0.5,
    targetSpeed: 0.6,
    targetY: 8,
    willJoinGroup: true,
    groupPosition: 0,
  },
  {
    x: -1280,
    speed: 0.7,
    color: "#9333ea",
    signText: "🔑",
    bodyHeight: 25,
    wobbleOffset: 6,
    unrulyLevel: 0.6,
    originalSpeed: 0.7,
    targetSpeed: 0.6,
    targetY: -5,
    willJoinGroup: true,
    groupPosition: 1,
  },
  {
    x: -1320,
    speed: 0.4,
    color: "#ec4899",
    signText: "🏚️",
    bodyHeight: 27,
    wobbleOffset: 7,
    unrulyLevel: 0.9,
    originalSpeed: 0.4,
    targetSpeed: 0.6,
    targetY: 4,
    willJoinGroup: true,
    groupPosition: 2,
  },
  {
    x: -1420,
    speed: 0.8,
    color: "#7c3aed",
    signText: "🏡",
    bodyHeight: 26,
    wobbleOffset: 8,
    unrulyLevel: 0.7,
    originalSpeed: 0.8,
    targetSpeed: 0.6,
    targetY: -3,
    willJoinGroup: true,
    groupPosition: 3,
  },
  {
    x: -1500,
    speed: 0.3,
    color: "#8b5cf6",
    signText: "🏢",
    bodyHeight: 28,
    wobbleOffset: 9,
    unrulyLevel: 1.0,
    originalSpeed: 0.3,
    targetSpeed: 0.6,
    targetY: 6,
    willJoinGroup: true,
    groupPosition: 4,
  },
  {
    x: -1580,
    speed: 0.6,
    color: "#c026d3",
    signText: "🛡️",
    bodyHeight: 24,
    wobbleOffset: 10,
    unrulyLevel: 0.5,
    originalSpeed: 0.6,
    targetSpeed: 0.6,
    targetY: -4,
    willJoinGroup: true,
    groupPosition: 5,
  },
];
