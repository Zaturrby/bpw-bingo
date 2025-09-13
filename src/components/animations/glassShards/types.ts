export interface GlassShard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
  trail: Array<{
    x: number;
    y: number;
    opacity: number;
    rotation: number;
  }>;
}

export interface GlassShardsProps {
  trigger: boolean;
  onComplete?: () => void;
  boardRect?: DOMRect; // Optional board position for origin point
}

export interface ShardConfig {
  count: number;
  minSize: number;
  maxSize: number;
  minSpeed: number;
  maxSpeed: number;
  gravity: number;
  airResistance: number;
  maxLife: number;
  trailLength: number;
}