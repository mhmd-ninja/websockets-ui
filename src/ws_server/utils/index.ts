import { Command } from "../../types";

export const getRandomId = () => Math.floor(10000000 + Math.random() * 90000000);

export const toSerializedMessage = (type: Command, payload: object) => {
    return JSON.stringify({
      type,
      data: JSON.stringify(payload),
      id: 0,
    });
  };

export const getNeighborCells = (
  cell: [x: number, y: number],
): [x: number, y: number][] => {
  const [x, y] = cell;
  const neighbors: [x: number, y: number][] = [];

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  directions.forEach(([dr, dc]) => {
    const newRow = x + dr;
    const newCol = y + dc;

    if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
      neighbors.push([newRow, newCol]);
    }
  });
  return neighbors;
};
  