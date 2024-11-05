import React, { useState } from "react";
import { Node, Position } from "../../types";
import NodeComponent from "../Node";
import { dijkstra } from "../../algorithms/dijkstra";
import { aStar } from "../../algorithms/aStar";

const GRID_SIZE = 20;

const createInitialGrid = (): Node[][] => {
  const grid: Node[][] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    const currentRow: Node[] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      currentRow.push({
        position: { x: row, y: col },
        isWall: false,
        status: "unvisited",
        isStart: row === 0 && col === 0,
        isEnd: row === GRID_SIZE - 1 && col === GRID_SIZE - 1,
        gCost: Infinity,
      });
    }
    grid.push(currentRow);
  }
  return grid;
};

const Grid: React.FC = () => {
  const [grid, setGrid] = useState(createInitialGrid);
  const [selectingStart, setSelectingStart] = useState(false);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = () => setIsMouseDown(true);
  const handleMouseUp = () => setIsMouseDown(false);

  const handleNodeClick = (position: Position) => {
    setGrid((prevGrid) => {
      return prevGrid.map((row) =>
        row.map((node) => {
          if (
            node.position.x === position.x &&
            node.position.y === position.y
          ) {
            if (selectingStart) {
              setSelectingStart(false);
              return {
                ...node,
                isStart: true,
                isEnd: false,
                isWall: false,
                status: "unvisited",
              };
            } else if (selectingEnd) {
              setSelectingEnd(false);
              return {
                ...node,
                isEnd: true,
                isStart: false,
                isWall: false,
                status: "unvisited",
              };
            } else {
              return node.isStart || node.isEnd
                ? node
                : {
                    ...node,
                    isWall: !node.isWall,
                    status: !node.isWall ? "wall" : "unvisited",
                  };
            }
          }
          if (selectingStart && node.isStart)
            return { ...node, isStart: false };
          if (selectingEnd && node.isEnd) return { ...node, isEnd: false };
          return node;
        })
      );
    });
  };

  const handleNodeDrag = (position: Position) => {
    if (isMouseDown && !selectingStart && !selectingEnd) {
      handleNodeClick(position);
    }
  };

  const visualizeDijkstra = () => {
    const startNode = grid.flat().find((node) => node.isStart);
    const endNode = grid.flat().find((node) => node.isEnd);
    if (startNode && endNode) {
      dijkstra(grid, startNode, endNode, updateNodeStatus);
    }
  };

  const visualizeAStar = () => {
    const startNode = grid.flat().find((node) => node.isStart);
    const endNode = grid.flat().find((node) => node.isEnd);
    if (startNode && endNode) {
      aStar(grid, startNode, endNode, updateNodeStatus);
    }
  };

  const updateNodeStatus = (position: Position, status: Node["status"]) => {
    setGrid((prevGrid) =>
      prevGrid.map((row) =>
        row.map((node) =>
          node.position.x === position.x && node.position.y === position.y
            ? { ...node, status }
            : node
        )
      )
    );
  };

  const handleResetGrid = () => {
    setGrid(createInitialGrid());
  };

  const handleClearGrid = () => {
    setGrid((prevGrid) =>
      prevGrid.map((row) =>
        row.map((node) =>
          node.isWall || node.isStart || node.isEnd
            ? node
            : { ...node, status: "unvisited" }
        )
      )
    );
  };

  return (
    <>
      <button onClick={handleResetGrid}>Reset</button>
      <button onClick={handleClearGrid}>Clear</button>
      <button onClick={() => setSelectingStart(true)}>Set Start Node</button>
      <button onClick={() => setSelectingEnd(true)}>Set End Node</button>
      <button onClick={visualizeDijkstra}>Run Dijkstra</button>
      <button onClick={visualizeAStar}>Run A*</button>
      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((node, colIndex) => (
              <NodeComponent
                key={`${rowIndex}-${colIndex}`}
                node={node}
                onNodeClick={handleNodeClick}
                onNodeDrag={handleNodeDrag}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Grid;
