import { type MouseEventHandler } from "react";
import { BsFillPlayFill } from "react-icons/bs";
import { GrPowerReset } from "react-icons/gr";

export function PlayButton({
  handlerRunVisualizer,
  isDisabled,
  isGraphVisualized,
  showHumanReset,
}: {
  isDisabled: boolean;
  isGraphVisualized: boolean;
  showHumanReset: boolean;
  handlerRunVisualizer: MouseEventHandler<HTMLButtonElement>;
}) {
  const showReset = isGraphVisualized || showHumanReset;

  return (
    <button
      disabled={isDisabled && !showHumanReset}
      onClick={handlerRunVisualizer}
      aria-label={showReset ? "Reset" : "Start"}
      title={showReset ? "Reset" : "Start"}
      className="disabled:pointer-events-none disabled:opacity-50 transition ease-in rounded-full p-2.5 shadow-md bg-green-500 hover:bg-green-600 border-none active:ring-green-300 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-30"
    >
      {showReset ? (
        <GrPowerReset className="w-5 h-5" />
      ) : (
        <BsFillPlayFill className="w-5 h-5" />
      )}
    </button>
  );
}
