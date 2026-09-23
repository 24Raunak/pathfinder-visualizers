import { getUntraversedNeighbors } from "../../../utils/getUntraversedNeighbors";
import { isEqual } from "../../../utils/helpers";
import { initHeuristicCost } from "../../../utils/heuristics";
import { type GridType, type TileType } from "../../../utils/types";

/**
 * Greedy Best-First Search.
 * Uses only h(n) = Manhattan distance to prioritize the frontier.
 * Unlike A*, it does not account for the cost already travelled.
 */
export const greedyBestFirst = (
  grid: GridType,
  startTile: TileType,
  endTile: TileType
) => {
  const traversedTiles: TileType[] = [];
  const heuristicCost = initHeuristicCost(grid, endTile);
  const frontier: TileType[] = [];
  const start = grid[startTile.row][startTile.col];

  start.distance = 0;
  start.isTraversed = true;
  frontier.push(start);

  while (frontier.length > 0) {
    frontier.sort(
      (a, b) =>
        heuristicCost[a.row][a.col] - heuristicCost[b.row][b.col]
    );

    const current = frontier.shift();
    if (!current || current.isWall) continue;

    traversedTiles.push(current);
    if (isEqual(current, endTile)) break;

    const neighbors = getUntraversedNeighbors(grid, current);

    for (const neighbor of neighbors) {
      if (neighbor.isWall || neighbor.isTraversed) continue;

      neighbor.distance = current.distance + 1;
      neighbor.parent = current;
      neighbor.isTraversed = true;
      frontier.push(neighbor);
    }
  }

  const path: TileType[] = [];
  let current: TileType | null = grid[endTile.row][endTile.col];

  if (current.parent || isEqual(current, start)) {
    while (current !== null) {
      current.isPath = true;
      path.unshift(current);
      current = current.parent;
    }
  }

  return { traversedTiles, path };
};
