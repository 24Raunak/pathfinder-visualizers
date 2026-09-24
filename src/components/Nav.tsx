import { type RefObject, useEffect, useState } from "react";
import { usePathfinding } from "../hooks/usePathfinding";
import { useTile } from "../hooks/useTile";
import {
  EXTENDED_SLEEP_TIME,
  MAZES,
  PATHFINDING_ALGORITHMS,
  SLEEP_TIME,
  SPEEDS,
} from "../utils/constants";
import { resetGrid } from "../utils/resetGrid";
import { type MazeType } from "../utils/types";
import RadioGroup from "./RadioGroup";
import { useSpeed } from "../hooks/useSpeed";
import { runMazeAlgorithm } from "../utils/runMazeAlgorithm";
import { PlayButton } from "./PlayButton";
import { runPathfindingAlgorithm } from "../utils/runPathfindingAlgorithm";
import { animatePath } from "../utils/animatePath";
import { useHumanGame } from "../hooks/useHumanGame";

export function Nav({
  isVisualizationRunningRef,
}: {
  isVisualizationRunningRef: RefObject<boolean>;
}) {
  const [isDisabled, setIsDisabled] = useState(false);

  const {
    maze,
    setMaze,
    grid,
    setGrid,
    isGraphVisualized,
    setIsGraphVisualized,
    algorithm,
    setAlgorithm,
  } = usePathfinding();

  const { startTile, endTile } = useTile();
  const { speed, setSpeed } = useSpeed();
  const {
    status: humanGameStatus,
    moves: humanMoves,
    elapsedSeconds: humanElapsedSeconds,
    startGame,
    resetGame,
  } = useHumanGame();

  useEffect(() => {
    if (humanGameStatus === "won") {
      setIsDisabled(false);
      setIsGraphVisualized(true);
      isVisualizationRunningRef.current = false;
    }
  }, [humanGameStatus, setIsGraphVisualized, isVisualizationRunningRef]);

  const handleGenerateMaze = (selectedMaze: MazeType) => {
    if (selectedMaze === "NONE") {
      setMaze(selectedMaze);
      resetGrid({ grid, startTile, endTile });
      resetGame(startTile);
      setIsGraphVisualized(false);
      return;
    }

    setMaze(selectedMaze);
    setIsDisabled(true);
    resetGame(startTile);

    runMazeAlgorithm({
      maze: selectedMaze,
      grid,
      startTile,
      endTile,
      setIsDisabled,
      speed,
    });

    const newGrid = grid.slice();
    setGrid(newGrid);
    setIsGraphVisualized(false);
  };

  const handleAlgorithmChange = (nextAlgorithm: typeof algorithm) => {
    setAlgorithm(nextAlgorithm);
    setIsGraphVisualized(false);
    setIsDisabled(false);
    resetGame(startTile);
  };

  const handlerRunVisualizer = () => {
    if (algorithm === "HUMAN") {
      if (humanGameStatus === "playing" || humanGameStatus === "won") {
        resetGame(startTile);
        setIsGraphVisualized(false);
        setIsDisabled(false);
        return;
      }

      setIsGraphVisualized(false);
      setIsDisabled(true);
      startGame(startTile);
      return;
    }

    if (isGraphVisualized) {
      setIsGraphVisualized(false);

      resetGrid({
        grid: grid.slice(),
        startTile,
        endTile,
      });

      return;
    }

    const { traversedTiles, path } = runPathfindingAlgorithm({
      algorithm,
      grid,
      startTile,
      endTile,
    });

    animatePath(traversedTiles, path, startTile, endTile, speed);

    setIsDisabled(true);
    isVisualizationRunningRef.current = true;

    setTimeout(
      () => {
        const newGrid = grid.slice();

        setGrid(newGrid);
        setIsGraphVisualized(true);
        setIsDisabled(false);
        isVisualizationRunningRef.current = false;
      },
      SLEEP_TIME * (traversedTiles.length + SLEEP_TIME * 2) +
        EXTENDED_SLEEP_TIME *
          (path.length + 60) *
          SPEEDS.find((s) => s.value === speed)!.value,
    );
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-center min-h-18 border-b shadow-gray-600 sm:px-5 px-0">
      <div className="flex items-center lg:justify-between justify-center w-full sm:w-208">
        <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-3 sm:gap-6 sm:py-0 py-4 mt-2 mb-2">
          <RadioGroup
            label="Maze"
            value={maze}
            options={MAZES}
            isDisabled={isDisabled}
            onChange={handleGenerateMaze}
          />

          <RadioGroup
            label="Graph"
            value={algorithm}
            options={PATHFINDING_ALGORITHMS}
            isDisabled={isDisabled}
            onChange={handleAlgorithmChange}
          />

          <div className="flex flex-col gap-1">
            <RadioGroup
              label={algorithm === "HUMAN" ? "Human" : "Speed"}
              value={speed}
              options={SPEEDS}
              isDisabled={isDisabled || algorithm === "HUMAN"}
              onChange={setSpeed}
            />
            {algorithm === "HUMAN" && (
              <span className="text-[11px] text-slate-500">
                {humanGameStatus === "won"
                  ? `Solved in ${humanMoves} moves · ${formatTime(humanElapsedSeconds)}`
                  : humanGameStatus === "playing"
                    ? `Moves: ${humanMoves} · Time: ${formatTime(humanElapsedSeconds)}`
                    : "Use WASD or arrow keys"}
              </span>
            )}
          </div>

          <PlayButton
            isDisabled={isDisabled}
            isGraphVisualized={isGraphVisualized}
            showHumanReset={
              algorithm === "HUMAN" && humanGameStatus === "playing"
            }
            handlerRunVisualizer={handlerRunVisualizer}
          />
        </div>
      </div>
    </div>
  );
}
