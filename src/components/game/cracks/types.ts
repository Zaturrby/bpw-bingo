export interface CrackSegment {
  x: number;
  y: number;
  generation: number; // 0 = main crack, 1 = first branch, etc.
}

export interface Crack {
  startX: number;
  startY: number;
  segments: CrackSegment[];
  maxWidth: number;
  currentProgress: number; // 0-1 how much of this crack is revealed
}

export interface CrackStorage {
  cracks: Crack[];
  lastProgress: number;
  lastLoggedProgress?: number;
}

export interface CrackOverlayProps {
  globalProgress: number; // 0-1 based on total checked squares
  squareColor: string; // Original square color
  isVisible: boolean;
  squareId: number; // Unique square ID for stable crack generation
}