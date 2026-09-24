import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { GridType, TileType } from "../utils/types";

export type HumanGameStatus = "idle" | "playing" | "won";

type PlayerPosition = {
  row: number;
  col: number;
};

interface HumanGameContextInterface {
  status: HumanGameStatus;
  playerPosition: PlayerPosition | null;
  visitedPositions: PlayerPosition[];
  moves: number;
  elapsedSeconds: number;
  startGame: (startTile: TileType) => void;
  resetGame: (startTile: TileType) => void;
  movePlayer: (grid: GridType, endTile: TileType, rowDelta: number, colDelta: number) => void;
}

export const HumanGameContext = createContext<HumanGameContextInterface | undefined>(
  undefined,
);

export const HumanGameProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<HumanGameStatus>("idle");
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition | null>(null);
  const [visitedPositions, setVisitedPositions] = useState<PlayerPosition[]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (status !== "playing") {
      return;
    }

    const interval = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [status]);

  const resetGame = (startTile: TileType) => {
    const position = { row: startTile.row, col: startTile.col };
    setStatus("idle");
    setPlayerPosition(position);
    setVisitedPositions([position]);
    setMoves(0);
    setElapsedSeconds(0);
  };

  const startGame = (startTile: TileType) => {
    const position = { row: startTile.row, col: startTile.col };
    setStatus("playing");
    setPlayerPosition(position);
    setVisitedPositions([position]);
    setMoves(0);
    setElapsedSeconds(0);
  };

  const movePlayer = (
    grid: GridType,
    endTile: TileType,
    rowDelta: number,
    colDelta: number,
  ) => {
    if (status !== "playing" || !playerPosition) {
      return;
    }

    const nextRow = playerPosition.row + rowDelta;
    const nextCol = playerPosition.col + colDelta;

    if (
      nextRow < 0 ||
      nextRow >= grid.length ||
      nextCol < 0 ||
      nextCol >= grid[0].length
    ) {
      return;
    }

    const nextTile = grid[nextRow][nextCol];

    if (nextTile.isWall) {
      return;
    }

    const nextPosition = { row: nextRow, col: nextCol };

    setPlayerPosition(nextPosition);
    setVisitedPositions((positions) => {
      const alreadyVisited = positions.some(
        (position) => position.row === nextRow && position.col === nextCol,
      );

      return alreadyVisited ? positions : [...positions, nextPosition];
    });
    setMoves((currentMoves) => currentMoves + 1);

    if (nextRow === endTile.row && nextCol === endTile.col) {
      setStatus("won");
    }
  };

  const value = useMemo(
    () => ({
      status,
      playerPosition,
      visitedPositions,
      moves,
      elapsedSeconds,
      startGame,
      resetGame,
      movePlayer,
    }),
    [status, playerPosition, visitedPositions, moves, elapsedSeconds],
  );

  return (
    <HumanGameContext.Provider value={value}>
      {children}
    </HumanGameContext.Provider>
  );
};
