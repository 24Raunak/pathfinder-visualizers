import { twMerge } from "tailwind-merge";
import {
  END_TILE_STYLE,
  PATH_TILE_STYLE,
  START_TILE_STYLE,
  TILE_STYLE,
  TRAVERSED_TILE_STYLE,
  WALL_TILE_STYLE,
  MAX_ROWS,
  MAX_COLS,
} from "../utils/constants";

interface MouseFunction {
  (row: number, col: number): void;
}

export function Tile({
  row,
  col,
  isStart,
  isEnd,
  isTraversed,
  isWall,
  isPath,
  isPlayer,
  isVisitedByPlayer,
  isDragging,
  handleMouseDown,
  handleMouseUp,
  handleMouseEnter,
}: {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isTraversed: boolean;
  isWall: boolean;
  isPath: boolean;
  isPlayer: boolean;
  isVisitedByPlayer: boolean;
  isDragging: boolean;
  handleMouseDown: MouseFunction;
  handleMouseUp: MouseFunction;
  handleMouseEnter: MouseFunction;
}) {
  let tileStyle = TILE_STYLE;

  if (isStart) {
    tileStyle = START_TILE_STYLE;
  } else if (isEnd) {
    tileStyle = END_TILE_STYLE;
  } else if (isWall) {
    tileStyle = WALL_TILE_STYLE;
  } else if (isPath) {
    tileStyle = PATH_TILE_STYLE;
  } else if (isTraversed) {
    tileStyle = TRAVERSED_TILE_STYLE;
  }

  const isLastRow = row === MAX_ROWS - 1;
  const isLastColumn = col === MAX_COLS - 1;

  return (
    <div
      className={twMerge(
        tileStyle,
        isLastRow && "border-b",
        isLastColumn && "border-r",
        "relative min-w-0 select-none",
        isVisitedByPlayer && !isStart && !isEnd && !isWall && "bg-emerald-100",
        isStart || isEnd ? "cursor-grab" : "cursor-pointer",
        isDragging && "cursor-grabbing",
      )}
      id={`${row}-${col}`}
      onMouseDown={() => handleMouseDown(row, col)}
      onMouseUp={() => handleMouseUp(row, col)}
      onMouseEnter={() => handleMouseEnter(row, col)}
    >
      {isPlayer && (
        <span className="absolute inset-1/4 rounded-full bg-purple-700 ring-2 ring-purple-300" />
      )}
    </div>
  );
}
