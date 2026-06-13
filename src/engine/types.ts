export enum TileType {
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  GOLD = 'GOLD',
}

export interface TileData {
  id: string;
  type: TileType;
  lane: number;       // 0–3
  spawnTime: number;   // Date.now() when spawned
  fallDuration: number; // ms to traverse the full board height
  hit: boolean;
}

export interface GameState {
  score: number;
  combo: number;
  shields: number;
  isGameOver: boolean;
  isStarted: boolean;
  tiles: TileData[];
  fallDuration: number;
}
