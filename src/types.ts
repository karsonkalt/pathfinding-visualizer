export type Position = { x: number; y: number };

export interface Node {
  position: Position;
  isWall: boolean;
  status: "unvisited" | "visited" | "path" | "wall";
  isStart: boolean;
  isEnd: boolean;
  gCost?: number;
  hCost?: number;
  fCost?: number;
  previous?: Node | null;
}
