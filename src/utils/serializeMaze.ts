import type { TileType } from "./types";

export function serializeGrid(grid: TileType[][]) {
  const walls: [number, number][] = [];

  for (const row of grid) {
    for (const tile of row) {
      if (tile.isWall) {
        walls.push([tile.row, tile.col]);
      }
    }
  }

  return walls;
}