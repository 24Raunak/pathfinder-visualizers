import { useContext } from "react";
import { HumanGameContext } from "../context/HumanGameContext";

export const useHumanGame = () => {
  const context = useContext(HumanGameContext);

  if (!context) {
    throw new Error("useHumanGame must be used within HumanGameProvider");
  }

  return context;
};
