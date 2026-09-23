export type AlgorithmType =
  | "DIJKSTRA"
  | "A_STAR"
  | "BFS"
  | "DFS"
  | "GREEDY_BEST_FIRST"
  | "BIDIRECTIONAL_BFS"
  | "IDDFS";
export interface AlgorithmSelectType {
  name: string;
  value: AlgorithmType;
}

export type MazeType = "NONE" | "BINARY_TREE" | "RECURSIVE_DIVISION";
export interface MazeSelectType {
  name: string;
  value: MazeType;
}

export type TileType = {
  row: number;
  col: number;
  isEnd: boolean;
  isWall: boolean;
  isPath: boolean;
  distance: number;
  isTraversed: boolean;
  isStart: boolean;
  parent: TileType | null;
};

export type GridType = TileType[][];

export type SpeedType = 4 | 2 | 1 | 0.5 | 0.25 | 0.1;
export interface SpeedSelectType {
  name: string;
  value: SpeedType;
}
