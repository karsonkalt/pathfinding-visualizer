import React from "react";
import Grid from "./components/Grid";

const App: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Pathfinding Visualizer</h1>
      <Grid />
    </div>
  );
};

export default App;
