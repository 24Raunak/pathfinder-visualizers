import { type RefObject, useState } from "react";
import { usePathfinding } from "../hooks/usePathfinding";
import { Tile } from "./Tile";
import { checkIfStartOrEnd, createNewGrid } from "../utils/helpers";

export function Grid({
  isVisualizationRunningRef,
}: {
  isVisualizationRunningRef: RefObject<boolean>;
}) {
  const { grid, setGrid } = usePathfinding();

  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = (row: number, col: number) => {
    if (
      isVisualizationRunningRef.current ||
      checkIfStartOrEnd(row, col)
    ) {
      return;
    }

    setIsMouseDown(true);

    const newGrid = createNewGrid(grid, row, col);

    setGrid(newGrid);
  };

  const handleMouseUp = (row: number, col: number) => {
    if (
      isVisualizationRunningRef.current ||
      checkIfStartOrEnd(row, col)
    ) {
      return;
    }

    setIsMouseDown(false);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (
      isVisualizationRunningRef.current ||
      checkIfStartOrEnd(row, col)
    ) {
      return;
    }

    if (isMouseDown) {
      const newGrid = createNewGrid(grid, row, col);

      setGrid(newGrid);
    }
  };

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6">
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
        onMouseLeave={() => setIsMouseDown(false)}
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