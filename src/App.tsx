import { useRef } from "react";
import { Grid } from "./components/Grid";
import { PathfindingProvider } from "./context/PathfindingContext";
import { SpeedProvider } from "./context/SpeedContext";
import { TileProvider } from "./context/TileContext";
import { Nav } from "./components/Nav";
import { HumanGameProvider } from "./context/HumanGameContext";

function App() {
  const isVisualizationRunningRef = useRef(false);

  return (
    <PathfindingProvider>
      <TileProvider>
        <SpeedProvider>
          <HumanGameProvider>
            <div className="h-screen w-screen flex flex-col bg-gray">
            {/* <h1 className="lg:flex hidden font-bold w-[40%] text-4xl pl-1">Pathfinding Visualizer</h1> */}
            <Nav isVisualizationRunningRef={isVisualizationRunningRef} />
            <Grid isVisualizationRunningRef={isVisualizationRunningRef} />
            </div>
          </HumanGameProvider>
        </SpeedProvider>
      </TileProvider>
    </PathfindingProvider>
  );
}

export default App;
