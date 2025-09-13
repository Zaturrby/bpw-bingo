// Main component
export { GlassShards } from './GlassShards';

// Types
export * from './types';

// Core functionality
export { generateGlassShards, createShardBurst, createGridExplosion, DEFAULT_SHARD_CONFIG, FINALE_SHARD_CONFIG } from './generator';
export { updateShardPhysics, updateAllShards, resetExplosionLogging } from './physics';
export { drawGlassShard, renderAllShards } from './renderer';

// Simplified timing system
export { getSimpleExplosionTiming, isSimpleFinaleSquare, SIMPLE_TIMING } from './simpleTiming';
export type { SimpleTimingConfig } from './simpleTiming';