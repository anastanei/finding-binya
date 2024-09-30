// import { Component } from "./component.js";
import { getRandomNumber } from "./getRandomNumber.js";
import { createField } from "./createField.js";

const setMines = () => {
  const indices = new Set();
  while (indices.size < mines) {
    indices.add(getRandomNumber(length - 1));
  }
  indices.forEach((index) => {
    array[index] = "x";
  });

  return indices;
};

const getMatrix = (array, cols) => {
  const matrix = [];
  for (let i = 0; i < array.length; i += cols) {
    const row = array.slice(i, i + cols);
    matrix.push(row);
  }
  return matrix;
};

const mineAdjacents = () => {
  mineIndices.forEach((item) => {
    const i = Math.floor(item / cols);
    const k = item % cols;
    directions.forEach(([dirI, dirK]) => {
      const newI = dirI + i;
      const newK = dirK + k;
      if (newI >= 0 && newI < rows && newK >= 0 && newK < cols) {
        if (matrix[newI][newK] !== "x") {
          matrix[newI][newK] += 1;
        }
      }
    });
  });
};

const cols = 9;
const rows = 9;

const length = cols * rows;

const mines = Math.floor(length / 7);
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

const container = document.querySelector("[data-container]");
container.style.setProperty(
  "grid-template-columns",
  `repeat(${cols}, minmax(0, 1fr))`
);

let array = Array(length).fill(0);
const mineIndices = setMines();
let matrix = getMatrix(array, cols);
mineAdjacents();
matrix.flat().forEach((item) => createField(item));
