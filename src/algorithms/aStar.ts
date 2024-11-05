import { Node, Position } from "../types";

export const aStar = async (
  grid: Node[][],
  startNode: Node,
  endNode: Node,
  updateNodeStatus: (position: Position, status: Node["status"]) => void
) => {
  const openSet: Node[] = [startNode];
  startNode.gCost = 0;
  startNode.hCost = heuristic(startNode.position, endNode.position);
  startNode.fCost = startNode.hCost;

  while (openSet.length) {
    openSet.sort((a, b) => a.fCost! - b.fCost! || a.hCost! - b.hCost!);
    const currentNode = openSet.shift()!;

    if (currentNode.isWall) continue;
    if (currentNode === endNode) break;

    updateNodeStatus(currentNode.position, "visited");

    for (const neighbor of getNeighbors(grid, currentNode)) {
      if (neighbor.isWall || neighbor.status === "visited") continue;

      const tentativeGCost = currentNode.gCost! + 1;
      if (tentativeGCost < (neighbor.gCost || Infinity)) {
        neighbor.gCost = tentativeGCost;
        neighbor.hCost = heuristic(neighbor.position, endNode.position);
        neighbor.fCost = neighbor.gCost + neighbor.hCost;
        neighbor.previous = currentNode;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
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

const heuristic = (posA: Position, posB: Position): number => {
  return Math.abs(posA.x - posB.x) + Math.abs(posA.y - posB.y);
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
