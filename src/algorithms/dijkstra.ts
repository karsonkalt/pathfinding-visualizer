import { Node, Position } from "../types";

export const dijkstra = async (
  grid: Node[][],
  startNode: Node,
  endNode: Node,
  updateNodeStatus: (position: Position, status: Node["status"]) => void
) => {
  const unvisitedNodes: Node[] = [];
  startNode.status = "visited";
  startNode.gCost = 0;

  unvisitedNodes.push(startNode);

  while (unvisitedNodes.length) {
    unvisitedNodes.sort((a, b) => a.gCost! - b.gCost!);
    const currentNode = unvisitedNodes.shift()!;

    if (currentNode === endNode) break;

    for (let neighbor of getNeighbors(grid, currentNode)) {
      if (neighbor.isWall || neighbor.status === "visited") continue;

      const newGCost = currentNode.gCost! + 1;
      if (newGCost < (neighbor.gCost || Infinity)) {
        neighbor.gCost = newGCost;
        neighbor.previous = currentNode;
        unvisitedNodes.push(neighbor);

        updateNodeStatus(neighbor.position, "visited");
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  let currentNode = endNode;
  while (currentNode.previous) {
    updateNodeStatus(currentNode.position, "path");
    currentNode = currentNode.previous;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

const getNeighbors = (grid: Node[][], node: Node): Node[] => {
  const { x, y } = node.position;
  const neighbors: Node[] = [];
  if (x > 0) neighbors.push(grid[x - 1][y]);
  if (x < grid.length - 1) neighbors.push(grid[x + 1][y]);
  if (y > 0) neighbors.push(grid[x][y - 1]);
  if (y < grid[0].length - 1) neighbors.push(grid[x][y + 1]);
  return neighbors;
};
