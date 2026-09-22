import { type RefObject, useState } from "react";
import { usePathfinding } from "../hooks/usePathfinding";
import { useTile } from "../hooks/useTile";
import { Tile } from "./Tile";
import { createNewGrid } from "../utils/helpers";

type DraggingTile = "start" | "end" | null;

export function Grid({
  isVisualizationRunningRef,
}: {
  isVisualizationRunningRef: RefObject<boolean>;
}) {
  const { grid, setGrid } = usePathfinding();
  const { startTile, setStartTile, endTile, setEndTile } = useTile();

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [draggingTile, setDraggingTile] = useState<DraggingTile>(null);

  const moveSpecialTile = (
    row: number,
    col: number,
    type: "start" | "end",
  ) => {
    // Don't allow start and end to occupy the same cell.
    const otherTile = type === "start" ? endTile : startTile;

    if (row === otherTile.row && col === otherTile.col) {
      return;
    }

    const oldTile = type === "start" ? startTile : endTile;

    const newGrid = grid.map((gridRow) =>
      gridRow.map((tile) => {
        // Remove the old start/end marker.
        if (tile.row === oldTile.row && tile.col === oldTile.col) {
          return {
            ...tile,
            isStart: type === "start" ? false : tile.isStart,
            isEnd: type === "end" ? false : tile.isEnd,
            isWall: false,
          };
        }

        // Don't turn the destination into a wall.
        if (tile.row === row && tile.col === col) {
          return {
            ...tile,
            isStart: type === "start",
            isEnd: type === "end",
            isWall: false,
            isPath: false,
            isTraversed: false,
            distance: Infinity,
            parent: null,
          };
        }

        return tile;
      }),
    );

    setGrid(newGrid);

    const movedTile = {
      ...oldTile,
      row,
      col,
      isStart: type === "start",
      isEnd: type === "end",
      isWall: false,
      isPath: false,
      isTraversed: false,
      distance: Infinity,
      parent: null,
    };

    if (type === "start") {
      setStartTile(movedTile);
    } else {
      setEndTile(movedTile);
    }
  };

  const handleMouseDown = (row: number, col: number) => {
    if (isVisualizationRunningRef.current) {
      return;
    }

    if (row === startTile.row && col === startTile.col) {
      setDraggingTile("start");
      setIsMouseDown(true);
      return;
    }

    if (row === endTile.row && col === endTile.col) {
      setDraggingTile("end");
      setIsMouseDown(true);
      return;
    }

    setDraggingTile(null);
    setIsMouseDown(true);

    setGrid(createNewGrid(grid, row, col));
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setDraggingTile(null);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isVisualizationRunningRef.current || !isMouseDown) {
      return;
    }

    if (draggingTile) {
      moveSpecialTile(row, col, draggingTile);
      return;
    }

    // Normal wall drawing.
    if (
      (row === startTile.row && col === startTile.col) ||
      (row === endTile.row && col === endTile.col)
    ) {
      return;
    }

    setGrid(createNewGrid(grid, row, col));
  };

  return (
    <div
      className="w-full px-2 sm:px-4 lg:px-6"
      onMouseUp={handleMouseUp}
    >
      <div
        className="
          w-full
          max-w-350
          mx-auto
          overflow-hidden
          rounded-md
          border
          border-slate-300
          bg-slate-100
          shadow-sm
        "
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${grid[0]?.length ?? 1}, minmax(0, 1fr))`,
        }}
        onMouseLeave={() => {
          setIsMouseDown(false);
        }}
      >
        {grid.map((row) =>
          row.map((tile) => {
            const {
              row: tileRow,
              col: tileCol,
              isEnd,
              isStart,
              isPath,
              isTraversed,
              isWall,
            } = tile;

            return (
              <Tile
                key={`${tileRow}-${tileCol}`}
                row={tileRow}
                col={tileCol}
                isEnd={isEnd}
                isStart={isStart}
                isPath={isPath}
                isTraversed={isTraversed}
                isWall={isWall}
                isDragging={
                  (draggingTile === "start" && isStart) ||
                  (draggingTile === "end" && isEnd)
                }
                handleMouseDown={handleMouseDown}
                handleMouseUp={handleMouseUp}
                handleMouseEnter={handleMouseEnter}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}