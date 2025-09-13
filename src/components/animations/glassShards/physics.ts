import { GlassShard, ShardConfig } from './types';
import { DEFAULT_SHARD_CONFIG } from './generator';

export const updateShardPhysics = (
  shard: GlassShard,
  config: ShardConfig = DEFAULT_SHARD_CONFIG
): boolean => {
  // Handle delayed start (negative life means waiting to start)
  if (shard.life < 0) {
    shard.life++;
    return true; // Keep shard but don't update physics yet
  }

  // Update trail only when shard is active
  shard.trail.push({
    x: shard.x,
    y: shard.y,
    opacity: 1 - shard.life / shard.maxLife,
    rotation: shard.rotation
  });

  // Keep trail length manageable
  if (shard.trail.length > config.trailLength) {
    shard.trail.shift();
  }

  // Apply physics
  shard.x += shard.vx;
  shard.y += shard.vy;

  // Gravity and air resistance
  shard.vy += config.gravity;
  shard.vx *= config.airResistance;
  shard.vy *= config.airResistance;

  // Enhanced rotation for sharp shards
  shard.rotation += shard.rotationSpeed;

  // Update life and opacity
  shard.life++;
  shard.opacity = Math.max(0, 1 - shard.life / shard.maxLife) * 0.9;

  // Add chaotic tumbling effect to rotation speed
  if (shard.life > 20) {
    shard.rotationSpeed *= 0.985; // Gradually slow down rotation
    // Add occasional random rotation bursts for chaos
    if (Math.random() < 0.02) {
      shard.rotationSpeed += (Math.random() - 0.5) * 0.1;
    }
  }

  // Return true if shard should continue to exist
  return shard.life < shard.maxLife && shard.opacity > 0.01;
};

export const updateAllShards = (
  shards: GlassShard[],
  config: ShardConfig = DEFAULT_SHARD_CONFIG
): GlassShard[] => {
  return shards.filter(shard => updateShardPhysics(shard, config));
};