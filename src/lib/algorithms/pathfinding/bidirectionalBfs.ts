import { isEqual } from "../../../utils/helpers";
import { type GridType, type TileType } from "../../../utils/types";

const getNeighbors = (grid: GridType, tile: TileType) => {
  const { row, col } = tile;
  const neighbors: TileType[] = [];

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
};

/**
 * Bidirectional BFS.
 * Searches simultaneously from the start and end until the two frontiers meet.
 */
export const bidirectionalBfs = (
  grid: GridType,
  startTile: TileType,
  endTile: TileType
) => {
  const traversedTiles: TileType[] = [];
  const start = grid[startTile.row][startTile.col];
  const end = grid[endTile.row][endTile.col];

  const startQueue: TileType[] = [start];
  const endQueue: TileType[] = [end];

  const startVisited = new Set<string>();
  const endVisited = new Set<string>();
  const startParent = new Map<string, TileType | null>();
  const endParent = new Map<string, TileType | null>();

  const key = (tile: TileType) => `${tile.row},${tile.col}`;

  startVisited.add(key(start));
  endVisited.add(key(end));
  startParent.set(key(start), null);
  endParent.set(key(end), null);

  let meetingTile: TileType | null = null;

  const visitLayer = (
    queue: TileType[],
    ownVisited: Set<string>,
    otherVisited: Set<string>,
    parents: Map<string, TileType | null>
  ) => {
    const layerSize = queue.length;

    for (let i = 0; i < layerSize; i += 1) {
      const current = queue.shift()!;
      if (!current.isWall) {
        current.isTraversed = true;
        traversedTiles.push(current);
      }

      if (otherVisited.has(key(current))) return current;

      for (const neighbor of getNeighbors(grid, current)) {
        const neighborKey = key(neighbor);
        if (neighbor.isWall || ownVisited.has(neighborKey)) continue;

        ownVisited.add(neighborKey);
        parents.set(neighborKey, current);
        queue.push(neighbor);

        if (otherVisited.has(neighborKey)) return neighbor;
      }
    }

    return null;
  };

  while (startQueue.length > 0 && endQueue.length > 0 && !meetingTile) {
    meetingTile =
      startQueue.length <= endQueue.length
        ? visitLayer(startQueue, startVisited, endVisited, startParent)
        : visitLayer(endQueue, endVisited, startVisited, endParent);
  }

  const path: TileType[] = [];

  if (meetingTile) {
    const startHalf: TileType[] = [];
    let currentKey: string | null = key(meetingTile);

    while (currentKey !== null) {
      const tile = grid[Number(currentKey.split(",")[0])][Number(currentKey.split(",")[1])];
      startHalf.unshift(tile);
      currentKey = startParent.get(currentKey)
        ? key(startParent.get(currentKey)!)
        : null;
    }

    const endHalf: TileType[] = [];
    currentKey = endParent.has(key(meetingTile))
      ? key(meetingTile)
      : null;

    while (currentKey !== null) {
      const tile = grid[Number(currentKey.split(",")[0])][Number(currentKey.split(",")[1])];
      if (!isEqual(tile, meetingTile)) endHalf.push(tile);
      const parent = endParent.get(currentKey);
      currentKey = parent ? key(parent) : null;
    }

    path.push(...startHalf, ...endHalf);

    for (const tile of path) {
      tile.isPath = true;
    }

    // Give the visualizer a conventional parent chain as well.
    for (let i = 1; i < path.length; i += 1) {
      path[i].parent = path[i - 1];
      path[i].distance = i;
    }
  }

  return { traversedTiles, path };
};
