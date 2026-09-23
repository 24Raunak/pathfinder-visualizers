import { isEqual } from "../../../utils/helpers";
import { type GridType, type TileType } from "../../../utils/types";

const neighborsOf = (grid: GridType, tile: TileType) => {
  const { row, col } = tile;
  const neighbors: TileType[] = [];

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
};

/**
 * Iterative Deepening Depth-First Search.
 * Repeatedly runs depth-limited DFS, increasing the depth limit each round.
 */
export const iterativeDeepeningDfs = (
  grid: GridType,
  startTile: TileType,
  endTile: TileType
) => {
  const traversedTiles: TileType[] = [];
  const start = grid[startTile.row][startTile.col];
  const end = grid[endTile.row][endTile.col];
  const maxDepth = grid.length * grid[0].length;

  let foundPath: TileType[] | null = null;

  const search = (
    current: TileType,
    depth: number,
    path: TileType[],
    visited: Set<string>
  ): boolean => {
    if (current.isWall) return false;

    current.isTraversed = true;
    traversedTiles.push(current);

    if (isEqual(current, end)) {
      foundPath = [...path, current];
      return true;
    }

    if (depth === 0) return false;

    const currentKey = `${current.row},${current.col}`;
    visited.add(currentKey);

    for (const neighbor of neighborsOf(grid, current)) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;

      if (neighbor.isWall || visited.has(neighborKey)) continue;

      neighbor.parent = current;
      neighbor.distance = current.distance + 1;

      if (search(neighbor, depth - 1, [...path, current], visited)) {
        return true;
      }
    }

    visited.delete(currentKey);
    return false;
  };

  for (let depth = 0; depth <= maxDepth && !foundPath; depth += 1) {
    const visited = new Set<string>();
    start.distance = 0;
    if (search(start, depth, [], visited)) break;
  }

  const path = foundPath ?? [];
  for (const tile of path) tile.isPath = true;

  return { traversedTiles, path };
};
