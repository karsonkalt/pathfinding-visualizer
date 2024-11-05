import React from "react";
import { Node, Position } from "../../types";

interface NodeProps {
  node: Node;
  onNodeClick: (position: Position) => void;
  onNodeDrag: (position: Position) => void;
}

const NodeComponent: React.FC<NodeProps> = ({
  node,
  onNodeClick,
  onNodeDrag,
}) => {
  const handleMouseDown = () => onNodeClick(node.position);
  const handleMouseEnter = () => onNodeDrag(node.position);

  let backgroundColor;
  if (node.isStart) backgroundColor = "green";
  else if (node.isEnd) backgroundColor = "red";
  else if (node.status === "visited") backgroundColor = "lightblue";
  else if (node.status === "path") backgroundColor = "yellow";
  else if (node.status === "wall") backgroundColor = "black";
  else backgroundColor = "white";

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      style={{
        width: "20px",
        height: "20px",
        backgroundColor,
        border: "1px solid gray",
      }}
    />
  );
};

export default NodeComponent;
