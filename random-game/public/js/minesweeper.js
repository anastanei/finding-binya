import { getRandomNumber } from "./getRandomNumber.js";
import { Cell } from "./cell.js";

export class Minesweeper {
  constructor(cols, rows, containerSelector) {
    this.cols = cols;
    this.rows = rows;
    this.length = this.cols * this.rows;
    this.mineAmount = Math.floor(this.length / 7);
    this.isStarted = false;
    this.container = document.querySelector(containerSelector);
    this.container.style.setProperty(
      "grid-template-columns",
      `repeat(${this.cols}, minmax(1.5rem, 1fr))`
    );

    this.init();
  }

  init() {
    this.array = Array(this.length).fill(0);
    this.matrix = this.getMatrix(this.array, this.cols);
    this.createEmptyField(this.matrix);

    this.container.addEventListener("click", (event) => {
      const cell = this.getCell(event);
      if (cell) {
        const [node, x, y] = cell;
        if (!this.isStarted) {
          this.handleFirstMove(x, y);
        }

        //openCell()
        if (this.matrix[y][x] === 0) {
          this.openAdjacentWhileEmpty(x, y);
        }
        node.disabled = true;
        //
      }
    });
  }

  openAdjacentWhileEmpty(x, y) {
    const adjacents = this.getAdjacents(x, y);
    adjacents.forEach(([x, y]) => {
      const matrixItem = this.matrix[y][x];
      if (matrixItem === 0) {
        const node = this.getCellFromPosition(x, y);
        if (node.disabled === false) {
          node.disabled = true;
          this.openAdjacentWhileEmpty(x, y);
        }
      }
      if (matrixItem !== "!") {
        this.getCellFromPosition(x, y).disabled = true;
      }
    });
  }

  handleFirstMove(x, y) {
    this.isStarted = true;
    const adjacents = this.getAdjacents(x, y);
    this.setEmptyStartingCells([[x, y], ...adjacents]);
    const minePositions = this.getMinePositions(this.mineAmount, this.array, [
      [x, y],
      ...adjacents,
    ]);
    minePositions.forEach(([x, y]) => this.setMatrixValues(x, y));
    this.setCellValues();
  }

  setMatrixValues(x, y) {
    this.matrix[y][x] = "!";
    const adjacents = this.getAdjacents(x, y);
    adjacents.forEach(([x, y]) => {
      if (this.matrix[y][x] !== "!") {
        this.matrix[y][x] += 1;
      }
    });
  }

  getCellFromPosition(x, y) {
    return this.container.querySelector(`[data-xpos="${x}"][data-ypos="${y}"]`);
  }

  setCellValues() {
    this.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        const cell = this.getCellFromPosition(x, y);
        if (cell) {
          cell.textContent = value;
        }
      });
    });
  }

  setEmptyStartingCells(array) {
    array.forEach(([x, y]) => {
      this.matrix[y][x] = 0;
    });
  }

  getMinePositions(mineAmount, array, emptyPositions) {
    const flatPositions = new Set();
    const positions = [];
    while (flatPositions.size < mineAmount) {
      const flatPosition = getRandomNumber(array.length - 1);
      const x = flatPosition % this.cols;
      const y = Math.floor(flatPosition / this.cols);

      const isEmpty = emptyPositions.some(
        ([emptyX, emptyY]) => emptyX === x && emptyY === y
      );
      if (!isEmpty) {
        const posKey = `${x},${y}`;
        if (!flatPositions.has(posKey)) {
          flatPositions.add(posKey);
          positions.push([x, y]);
        }
      }
    }
    return positions;
  }

  getMatrix(array, cols) {
    const matrix = [];
    for (let i = 0; i < array.length; i += cols) {
      const row = array.slice(i, i + cols);
      matrix.push(row);
    }
    return matrix;
  }

  createEmptyField(matrix) {
    matrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        this.container.appendChild(new Cell(x, y).getNode());
      });
    });
  }

  getAdjacents(x, y) {
    const adjacents = [];
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
    directions.forEach(([dirY, dirX]) => {
      const newY = dirY + y;
      const newX = dirX + x;
      if (newY >= 0 && newY < this.rows && newX >= 0 && newX < this.cols) {
        adjacents.push([newX, newY]);
      }
    });
    return adjacents;
  }

  getCell(event) {
    if (event.target && event.target.matches('[data-cell="true"]')) {
      const cell = event.target;
      const x = cell.getAttribute("data-xpos");
      const y = cell.getAttribute("data-ypos");
      return [event.target, parseInt(x), parseInt(y)];
    } else {
      return null;
    }
  }
}
