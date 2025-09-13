import { GlassShard, ShardConfig } from './types';

export const DEFAULT_SHARD_CONFIG: ShardConfig = {
  count: 45, // Per explosion origin - much more shards
  minSize: 6,
  maxSize: 20,
  minSpeed: 15,
  maxSpeed: 45,
  gravity: 0.25,
  airResistance: 0.985,
  maxLife: 300, // 5 seconds at 60fps - longer lasting
  trailLength: 10
};

// Special config for finale explosion - MASSIVE shard burst
export const FINALE_SHARD_CONFIG: ShardConfig = {
  count: 120, // MASSIVE explosion for finale squares
  minSize: 8,
  maxSize: 28,
  minSpeed: 20,
  maxSpeed: 65,
  gravity: 0.2, // Slightly less gravity for more dramatic arcs
  airResistance: 0.98,
  maxLife: 400, // Even longer lasting for finale
  trailLength: 15
};

const GLASS_COLORS = [
  '#ffffff', // Pure white
  '#f8fafc', // Very light gray
  '#e2e8f0', // Light gray
  '#cbd5e1', // Medium gray
  '#94a3b8', // Darker gray
  '#64748b', // Steel gray
  // Add some colored glass variants
  '#e9d5ff', // Light purple (from bingo colors)
  '#ddd6fe', // Light violet
  '#f5d0fe', // Light fuchsia
  '#fbcfe8', // Light pink
];

export const generateGlassShards = (
  originX: number,
  originY: number,
  config: ShardConfig = DEFAULT_SHARD_CONFIG
): GlassShard[] => {
  const shards: GlassShard[] = [];

  for (let i = 0; i < config.count; i++) {
    // Create radial explosion pattern
    const angle = (Math.PI * 2 * i) / config.count + (Math.random() - 0.5) * 0.5;
    const speed = config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed);

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
      height: config.minSize + Math.random() * (config.maxSize - config.minSize),
      color: GLASS_COLORS[Math.floor(Math.random() * GLASS_COLORS.length)],
      opacity: 0.85 + Math.random() * 0.15, // Higher base opacity for more visibility
      life: 0,
      maxLife: config.maxLife + Math.random() * 60, // Some variation in lifespan
      trail: []
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

// Dramatic timing pattern matching the crack finale exactly (4 second duration)
const getDramaticTiming = (squareIndex: number, totalSquares: number): number => {
  const TOTAL_DURATION = 4000; // Match crack system duration
  const progress = squareIndex / totalSquares;

  if (progress <= 0.2) {
    // First 20%: First square explodes (slow start)
    return squareIndex < 1 ? 0 : TOTAL_DURATION * 0.2; // 800ms
  } else if (progress <= 0.4) {
    // Next 20%: Second square explodes
    return squareIndex < 2 ? (squareIndex * TOTAL_DURATION * 0.2) : TOTAL_DURATION * 0.4; // 1600ms
  } else if (progress <= 0.7) {
    // Next 30%: Quick succession (8 squares)
    const quickPhaseIndex = squareIndex - 2;
    const quickDelay = TOTAL_DURATION * 0.4 + (quickPhaseIndex * 150); // 1600ms + 150ms intervals
    return Math.min(quickDelay, TOTAL_DURATION * 0.7); // Cap at 2800ms
  } else {
    // Final 30%: All finale squares explode simultaneously at 4000ms (finale completion)
    return TOTAL_DURATION; // 4000ms - massive finale explosion when cracks complete
  }
};

// Check if this square is part of the finale explosion
const isFinaleSquare = (squareIndex: number, totalSquares: number): boolean => {
  const progress = squareIndex / totalSquares;
  return progress > 0.7; // Final 30% get the massive explosion
};

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

  let squareIndex = 0;

  // Create explosion from each grid square with dramatic timing
  for (let row = 0; row < gridSize.rows; row++) {
    for (let col = 0; col < gridSize.cols; col++) {
      // Calculate center of this grid square
      const squareX = boardRect.left + (col + 0.5) * squareWidth;
      const squareY = boardRect.top + (row + 0.5) * squareHeight;

      // Get dramatic timing delay for this square
      const delay = getDramaticTiming(squareIndex, totalSquares);

      // Generate shards for this square - create multiple explosion origins for finale
      const isFinale = isFinaleSquare(squareIndex, totalSquares);
      let squareShards: GlassShard[] = [];

      if (isFinale) {
        // Create diverse explosion origins spread across the entire board area
        const explosionCount = 3; // Fewer explosions per finale square

        for (let i = 0; i < explosionCount; i++) {
          // Spread explosion points across the entire board, not just within square
          const boardPadding = Math.min(boardRect.width, boardRect.height) * 0.05;
          let explosionX, explosionY;

          if (i === 0) {
            // First explosion at square center
            explosionX = squareX;
            explosionY = squareY;
          } else {
            // Other explosions randomly across the board
            explosionX = boardRect.left + boardPadding + Math.random() * (boardRect.width - 2 * boardPadding);
            explosionY = boardRect.top + boardPadding + Math.random() * (boardRect.height - 2 * boardPadding);
          }

          const explosionShards = generateGlassShards(explosionX, explosionY, FINALE_SHARD_CONFIG);
          squareShards.push(...explosionShards);
        }
      } else {
        // Regular single explosion for non-finale squares
        squareShards = generateGlassShards(squareX, squareY, config);
      }

      // Apply dramatic delay to shard life (negative life = delayed start)
      squareShards.forEach(shard => {
        shard.life = -Math.floor(delay / (1000/60)); // Convert ms to frames
      });

      allShards.push(...squareShards);
      squareIndex++;
    }
  }

  return allShards;
};