import { GlassShard } from './types';

export const drawGlassShard = (
  ctx: CanvasRenderingContext2D,
  shard: GlassShard
): void => {
  // Don't render shards that haven't started yet
  if (shard.life < 0) return;

  ctx.save();

  // Draw trail first (behind the main shard)
  shard.trail.forEach((point, index) => {
    const trailOpacity = point.opacity * (index / shard.trail.length) * 0.3;
    if (trailOpacity > 0.01) {
      ctx.save();
      ctx.globalAlpha = trailOpacity;
      ctx.translate(point.x, point.y);
      ctx.rotate(point.rotation);

      // Draw trail shard as smaller version
      const trailSize = 0.3 + (index / shard.trail.length) * 0.4;
      const trailWidth = shard.width * trailSize;
      const trailHeight = shard.height * trailSize;

      ctx.fillStyle = shard.color;
      ctx.fillRect(-trailWidth / 2, -trailHeight / 2, trailWidth, trailHeight);

      ctx.restore();
    }
  });

  // Draw main glass shard
  ctx.globalAlpha = shard.opacity;
  ctx.translate(shard.x, shard.y);
  ctx.rotate(shard.rotation);

  // Glass effect: enhanced glow for better visibility
  ctx.shadowBlur = 6;
  ctx.shadowColor = shard.color;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  // Main shard body
  ctx.fillStyle = shard.color;
  ctx.fillRect(-shard.width / 2, -shard.height / 2, shard.width, shard.height);

  // Add sharp highlight edge for glass effect
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.globalAlpha = shard.opacity * 0.8; // Brighter highlight
  ctx.fillStyle = '#ffffff';

  // Create angular highlight (top-left edge)
  const highlightWidth = shard.width * 0.3;
  const highlightHeight = shard.height * 0.15;
  ctx.fillRect(-shard.width / 2, -shard.height / 2, highlightWidth, highlightHeight);

  // Add bottom-right shadow for depth
  ctx.globalAlpha = shard.opacity * 0.3; // Stronger shadow
  ctx.fillStyle = '#000000';
  const shadowSize = Math.min(shard.width, shard.height) * 0.25;
  ctx.fillRect(
    shard.width / 2 - shadowSize,
    shard.height / 2 - shadowSize,
    shadowSize,
    shadowSize
  );

  // Add extra glow around the shard
  ctx.globalAlpha = shard.opacity * 0.3;
  ctx.shadowBlur = 12;
  ctx.shadowColor = shard.color;
  ctx.fillStyle = shard.color;
  ctx.fillRect(-shard.width / 2 - 1, -shard.height / 2 - 1, shard.width + 2, shard.height + 2);

  ctx.restore();
};

export const renderAllShards = (
  ctx: CanvasRenderingContext2D,
  shards: GlassShard[]
): void => {
  // Sort shards by distance from camera (y position) for proper layering
  const sortedShards = [...shards].sort((a, b) => a.y - b.y);

  sortedShards.forEach(shard => {
    drawGlassShard(ctx, shard);
  });
};