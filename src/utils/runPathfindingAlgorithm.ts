import { aStar } from "../lib/algorithms/pathfinding/aStar";
import { bfs } from "../lib/algorithms/pathfinding/bfs";
import { dfs } from "../lib/algorithms/pathfinding/dfs";
import { dijkstra } from "../lib/algorithms/pathfinding/dijkstra";
import { greedyBestFirst } from "../lib/algorithms/pathfinding/greedyBestFirst";
import { bidirectionalBfs } from "../lib/algorithms/pathfinding/bidirectionalBfs";
import { iterativeDeepeningDfs } from "../lib/algorithms/pathfinding/iterativeDeepeningDfs";
import { type AlgorithmType, type GridType, type TileType } from "./types";

export const runPathfindingAlgorithm = ({
  algorithm,
  grid,
  startTile,
  endTile,
}: {
  algorithm: AlgorithmType;
  grid: GridType;
  startTile: TileType;
  endTile: TileType;
}) => {
  switch (algorithm) {
    case "BFS":
      return bfs(grid, startTile, endTile);
    case "DFS":
      return dfs(grid, startTile, endTile);
    case "DIJKSTRA":
      return dijkstra(grid, startTile, endTile);
    case "A_STAR":
      return aStar(grid, startTile, endTile);
    case "GREEDY_BEST_FIRST":
      return greedyBestFirst(grid, startTile, endTile);
    case "BIDIRECTIONAL_BFS":
      return bidirectionalBfs(grid, startTile, endTile);
    case "IDDFS":
      return iterativeDeepeningDfs(grid, startTile, endTile);
    default:
      return bfs(grid, startTile, endTile);
  }
};
