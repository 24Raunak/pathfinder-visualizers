import { type RefObject, useEffect, useRef, useState } from "react";
import { usePathfinding } from "../hooks/usePathfinding";
import { useTile } from "../hooks/useTile";
import { useHumanGame } from "../hooks/useHumanGame";
import { Tile } from "./Tile";
import { createNewGrid } from "../utils/helpers";

type DraggingTile = "start" | "end" | null;

type Direction = [number, number];

const DIRECTIONS: Record<string, Direction> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],

  w: [-1, 0],
  W: [-1, 0],
  s: [1, 0],
  S: [1, 0],
  a: [0, -1],
  A: [0, -1],
  d: [0, 1],
  D: [0, 1],
};

const KEY_REPEAT_DELAY = 120;
const KEY_REPEAT_INTERVAL = 60;

export function Grid({
  isVisualizationRunningRef,
}: {
  isVisualizationRunningRef: RefObject<boolean>;
}) {
  const { grid, setGrid, algorithm } = usePathfinding();
  const { startTile, setStartTile, endTile, setEndTile } = useTile();

  const {
    status: humanGameStatus,
    playerPosition,
    visitedPositions,
    movePlayer,
  } = useHumanGame();

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [draggingTile, setDraggingTile] = useState<DraggingTile>(null);

  const heldKeyRef = useRef<string | null>(null);
  const repeatTimeoutRef = useRef<number | null>(null);
  const repeatIntervalRef = useRef<number | null>(null);

  const humanModeLocked =
    algorithm === "HUMAN" && humanGameStatus !== "idle";

  const stopKeyRepeat = () => {
    heldKeyRef.current = null;

    if (repeatTimeoutRef.current !== null) {
      window.clearTimeout(repeatTimeoutRef.current);
      repeatTimeoutRef.current = null;
    }

    if (repeatIntervalRef.current !== null) {
      window.clearInterval(repeatIntervalRef.current);
      repeatIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (algorithm !== "HUMAN" || humanGameStatus !== "playing") {
      stopKeyRepeat();
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = DIRECTIONS[event.key];

      if (!direction) {
        return;
      }

      event.preventDefault();

      /*
       * Ignore the browser's own auto-repeat.
       * We handle key repetition ourselves.
       */
      if (heldKeyRef.current === event.key) {
        return;
      }

      stopKeyRepeat();

      heldKeyRef.current = event.key;

      /*
       * Move immediately.
       */
      movePlayer(
        grid,
        endTile,
        direction[0],
        direction[1],
      );

      /*
       * Wait briefly before starting continuous movement.
       */
      repeatTimeoutRef.current = window.setTimeout(() => {
        repeatIntervalRef.current = window.setInterval(() => {
          const key = heldKeyRef.current;

          if (!key) {
            return;
          }

          const currentDirection = DIRECTIONS[key];

          if (!currentDirection) {
            return;
          }

          movePlayer(
            grid,
            endTile,
            currentDirection[0],
            currentDirection[1],
          );
        }, KEY_REPEAT_INTERVAL);

        repeatTimeoutRef.current = null;
      }, KEY_REPEAT_DELAY);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (heldKeyRef.current === event.key) {
        stopKeyRepeat();
      }
    };

    const handleWindowBlur = () => {
      stopKeyRepeat();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      stopKeyRepeat();

      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [algorithm, humanGameStatus, grid, endTile, movePlayer]);

  const moveSpecialTile = (
    row: number,
    col: number,
    type: "start" | "end",
  ) => {
    if (humanModeLocked) {
      return;
    }

    const otherTile = type === "start" ? endTile : startTile;

    if (row === otherTile.row && col === otherTile.col) {
      return;
    }

    const oldTile = type === "start" ? startTile : endTile;

    const newGrid = grid.map((gridRow) =>
      gridRow.map((tile) => {
        if (
          tile.row === oldTile.row &&
          tile.col === oldTile.col
        ) {
          return {
            ...tile,
            isStart: type === "start" ? false : tile.isStart,
            isEnd: type === "end" ? false : tile.isEnd,
            isWall: false,
          };
        }

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
    if (
      isVisualizationRunningRef.current ||
      humanModeLocked
    ) {
      return;
    }

    if (
      row === startTile.row &&
      col === startTile.col
    ) {
      setDraggingTile("start");
      setIsMouseDown(true);
      return;
    }

    if (
      row === endTile.row &&
      col === endTile.col
    ) {
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

  const handleMouseEnter = (
    row: number,
    col: number,
  ) => {
    if (
      isVisualizationRunningRef.current ||
      humanModeLocked ||
      !isMouseDown
    ) {
      return;
    }

    if (draggingTile) {
      moveSpecialTile(row, col, draggingTile);
      return;
    }

    if (
      (row === startTile.row &&
        col === startTile.col) ||
      (row === endTile.row &&
        col === endTile.col)
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
        className="w-full max-w-350 mx-auto overflow-hidden rounded-md border border-slate-300 bg-slate-100 shadow-sm"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${
            grid[0]?.length ?? 1
          }, minmax(0, 1fr))`,
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

            const isPlayer =
              playerPosition?.row === tileRow &&
              playerPosition?.col === tileCol;

            const isVisitedByPlayer =
              visitedPositions.some(
                (position) =>
                  position.row === tileRow &&
                  position.col === tileCol,
              );

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
                isPlayer={isPlayer}
                isVisitedByPlayer={isVisitedByPlayer}
                isDragging={
                  (draggingTile === "start" &&
                    isStart) ||
                  (draggingTile === "end" &&
                    isEnd)
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