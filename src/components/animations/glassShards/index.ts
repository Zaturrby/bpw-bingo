// Main component
export { GlassShards } from './GlassShards';

// Types
export * from './types';

// Core functionality
export { generateGlassShards, createShardBurst, createGridExplosion, DEFAULT_SHARD_CONFIG, FINALE_SHARD_CONFIG } from './generator';
export { updateShardPhysics, updateAllShards } from './physics';
export { drawGlassShard, renderAllShards } from './renderer';