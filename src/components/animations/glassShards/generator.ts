import { GlassShard, ShardConfig } from "./types";
import { MASTER_ANIMATION_TIMING, getTimingMilestones } from "../shared/timing";

export const DEFAULT_SHARD_CONFIG: ShardConfig = {
  count: 45, // Per explosion origin - much more shards
  minSize: 6,
  maxSize: 20,
  minSpeed: 15,
  maxSpeed: 45,
  gravity: 0.25,
  airResistance: 0.985,
  maxLife: 180, // 3 seconds at 60fps - reduced for better timing
  trailLength: 10,
};

// Special config for finale explosion - reduced shard count but aligned timing
export const FINALE_SHARD_CONFIG: ShardConfig = {
  count: 60, // Reduced from 120 for better balance
  minSize: 8,
  maxSize: 28,
  minSpeed: 20,
  maxSpeed: 65,
  gravity: 0.2, // Slightly less gravity for more dramatic arcs
  airResistance: 0.98,
  maxLife: 72, // ~1.2 seconds at 60fps - much shorter to align with crack finale
  trailLength: 8,
};

const GLASS_COLORS = [
  "#ffffff", // Pure white
  "#f8fafc", // Very light gray
  "#e2e8f0", // Light gray
  "#cbd5e1", // Medium gray
  "#94a3b8", // Darker gray
  "#64748b", // Steel gray
  // Add some colored glass variants
  "#e9d5ff", // Light purple (from bingo colors)
  "#ddd6fe", // Light violet
  "#f5d0fe", // Light fuchsia
  "#fbcfe8", // Light pink
];

export const generateGlassShards = (
  originX: number,
  originY: number,
  config: ShardConfig = DEFAULT_SHARD_CONFIG
): GlassShard[] => {
  const shards: GlassShard[] = [];

  for (let i = 0; i < config.count; i++) {
    // Create radial explosion pattern
    const angle =
      (Math.PI * 2 * i) / config.count + (Math.random() - 0.5) * 0.5;
    const speed =
      config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed);

    // Add some vertical bias to make it more explosive upward
    const verticalBias = -Math.random() * 3;

    const shard: GlassShard = {
      x: originX + (Math.random() - 0.5) * 20, // Smaller random spread for more focused explosion
      y: originY + (Math.random() - 0.5) * 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed + verticalBias,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.4, // More rotation for chaos
      width: config.minSize + Math.random() * (config.maxSize - config.minSize),
      height:
        config.minSize + Math.random() * (config.maxSize - config.minSize),
      color: GLASS_COLORS[Math.floor(Math.random() * GLASS_COLORS.length)],
      opacity: 0.85 + Math.random() * 0.15, // Higher base opacity for more visibility
      life: 0,
      maxLife: config.maxLife + Math.random() * 60, // Some variation in lifespan
      trail: [],
    };

    // Make most shards very angular and sharp (glass-like)
    const shardType = Math.random();
    if (shardType < 0.6) {
      // Long thin shards (sharp splinters)
      shard.height = shard.width * (0.15 + Math.random() * 0.25);
    } else if (shardType < 0.8) {
      // Triangular/angular shards
      shard.width = shard.width * (0.3 + Math.random() * 0.4);
      shard.height = shard.height * (0.8 + Math.random() * 0.6);
    } else {
      // Very thin needle-like shards
      shard.height = shard.width * (0.05 + Math.random() * 0.15);
      shard.width = shard.width * 1.5; // Make them longer
    }

    shards.push(shard);
  }

  return shards;
};

export const createShardBurst = (
  boardRect: DOMRect,
  _canvas: HTMLCanvasElement,
  config: ShardConfig = DEFAULT_SHARD_CONFIG
): GlassShard[] => {
  // Calculate origin point from board center
  const originX = boardRect.left + boardRect.width / 2;
  const originY = boardRect.top + boardRect.height / 2;

  return generateGlassShards(originX, originY, config);
};

/**
 * Get explosion timing for a specific square using shared timing system
 */
const getSharedExplosionTiming = (
  squareIndex: number,
  totalSquares: number
): number => {
  const milestones = getTimingMilestones(MASTER_ANIMATION_TIMING);


  // First square - immediate
  if (squareIndex === 0) {
    return 0;
  }

  // Second square - at end of slow start phase
  if (squareIndex === 1) {
    return milestones.slowStartEnd; // 800ms
  }

  // Quick succession squares (up to 70% of total)
  const quickSuccessionCount = Math.floor(totalSquares * 0.7) - 2; // Subtract first 2 squares
  if (squareIndex < Math.floor(totalSquares * 0.7)) {
    const quickIndex = squareIndex - 2;
    const quickDuration = milestones.quickSuccessionEnd - milestones.buildUpEnd; // 2800 - 1600 = 1200ms
    const spacing = quickDuration / quickSuccessionCount;
    return milestones.buildUpEnd + (quickIndex * spacing); // 1600ms + spacing
  }

  // Finale squares - end at finale phase to align with crack completion
  return milestones.finaleEnd; // 4000ms
};


// Using shared timing system aligned with cracks

export const createGridExplosion = (
  boardRect: DOMRect,
  _canvas: HTMLCanvasElement,
  gridSize: { cols: number; rows: number } = { cols: 5, rows: 5 },
  config: ShardConfig = DEFAULT_SHARD_CONFIG
): GlassShard[] => {
  const allShards: GlassShard[] = [];
  const totalSquares = gridSize.cols * gridSize.rows;

  // Calculate individual square size
  const squareWidth = boardRect.width / gridSize.cols;
  const squareHeight = boardRect.height / gridSize.rows;

  // Create array of all grid positions and randomize them
  const gridPositions: Array<{ row: number; col: number; position: { x: number; y: number } }> = [];
  for (let row = 0; row < gridSize.rows; row++) {
    for (let col = 0; col < gridSize.cols; col++) {
      const squareX = boardRect.left + (col + 0.5) * squareWidth;
      const squareY = boardRect.top + (row + 0.5) * squareHeight;
      gridPositions.push({ row, col, position: { x: squareX, y: squareY } });
    }
  }

  // Shuffle the grid positions randomly
  for (let i = gridPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gridPositions[i], gridPositions[j]] = [gridPositions[j], gridPositions[i]];
  }

  // First 17 squares get individual timing (0ms, 800ms, 1600ms, etc.)
  const regularSquares = gridPositions.slice(0, 17);
  // Last 8 squares all explode together at finale (4000ms)
  const finaleSquares = gridPositions.slice(17);

  // Create regular explosions with staggered timing
  regularSquares.forEach((gridPos, index) => {
    const delay = getSharedExplosionTiming(index, totalSquares);
    const squareShards = generateGlassShards(gridPos.position.x, gridPos.position.y, config);

    squareShards.forEach((shard) => {
      (shard as any).targetExplosionTime = Date.now() + delay;
      shard.life = -1;
    });

    allShards.push(...squareShards);
  });

  // Create finale explosions - all 8 squares explode at 2800ms (when crack finale starts)
  const milestones = getTimingMilestones(MASTER_ANIMATION_TIMING);
  const finaleDelay = milestones.finaleStart; // 2800ms
  finaleSquares.forEach((gridPos) => {
    const squareShards = generateGlassShards(gridPos.position.x, gridPos.position.y, FINALE_SHARD_CONFIG);

    squareShards.forEach((shard) => {
      (shard as any).targetExplosionTime = Date.now() + finaleDelay;
      shard.life = -1;
    });

    allShards.push(...squareShards);
  });

  return allShards;
};
