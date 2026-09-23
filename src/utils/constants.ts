import {
  type AlgorithmSelectType,
  type MazeSelectType,
  type SpeedSelectType,
} from "./types";

/*
 * Grid configuration
 *
 * Desktop:
 * 24 rows × 60 columns = 1,440 tiles
 *
 * The CSS grid will make the tiles fit the available
 * container instead of giving every tile a fixed width.
 */
export const MAX_ROWS = 31;
export const MAX_COLS = 61;

export const START_TILE_CONFIGURATION = {
  row: 1,
  col: 1,
  isEnd: false,
  isWall: false,
  isPath: false,
  distance: 0,
  isStart: false,
  isTraversed: false,
  parent: null,
};

export const END_TILE_CONFIGURATION = {
  row: MAX_ROWS - 2,
  col: MAX_COLS - 2,
  isEnd: false,
  isWall: false,
  isPath: false,
  distance: 0,
  isStart: false,
  isTraversed: false,
  parent: null,
};

/*
 * Tiles no longer have fixed widths/heights.
 *
 * The Grid component controls their size using CSS Grid.
 */
export const TILE_STYLE =
  "w-full aspect-square border-r border-b border-slate-600/40";

export const TRAVERSED_TILE_STYLE = TILE_STYLE + " bg-gray-400";

export const START_TILE_STYLE = TILE_STYLE + " bg-blue-600";

export const END_TILE_STYLE = TILE_STYLE + " bg-red-600";

export const WALL_TILE_STYLE = TILE_STYLE + " bg-stone-600";

export const PATH_TILE_STYLE = TILE_STYLE + " bg-yellow-600";

export const MAZES: MazeSelectType[] = [
  { name: "No Maze", value: "NONE" },
  { name: "Binary Tree", value: "BINARY_TREE" },
  { name: "Recursive Division", value: "RECURSIVE_DIVISION" },
];

export const PATHFINDING_ALGORITHMS: AlgorithmSelectType[] = [
  { name: "Dijkstra", value: "DIJKSTRA" },
  { name: "A-Star", value: "A_STAR" },
  { name: "Breadth First Search", value: "BFS" },
  { name: "Depth First Search", value: "DFS" },
];

export const SPEEDS: SpeedSelectType[] = [
  { name: "Very Slow", value: 4 },
  { name: "Slow", value: 2 },
  { name: "Medium", value: 1 },
  { name: "Fast", value: 0.5 },
  { name: "Very Fast", value: 0.25 },
  { name: "Ultra Fast", value: 0.1 },
];

export const SLEEP_TIME = 8;
export const EXTENDED_SLEEP_TIME = 30;
