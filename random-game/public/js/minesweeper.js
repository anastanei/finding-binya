import { getRandomNumber } from "./getRandomNumber.js";
import { Cell } from "./cell.js";

export class Minesweeper {
  constructor(cols, rows, containerSelector) {
    this.cols = cols;
    this.rows = rows;
    this.length = this.cols * this.rows;
    this.mineAmount = Math.floor(this.length / 7);
    this.isStarted = false;
    this.disabledCount = 0;
    this.maxDisabledCount = this.length - this.mineAmount;
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
    this.cellNodes = {};
    this.createEmptyField(this.matrix);

    this.container.addEventListener("click", (event) => {
      console.log(event.type);
      const cell = this.getCell(event);
      if (cell) {
        const [node, x, y] = cell;
        if (!this.isStarted) {
          this.handleFirstMove(x, y);
        }

        const matrixItem = this.getMatrixValue(x, y);
        if (matrixItem === 0) {
          this.openCell(node, matrixItem);
          this.openAdjacentWhileEmpty(x, y);
        } else if (matrixItem === "mine") {
          this.openMines();
        } else {
          this.openCell(node, matrixItem);
        }
      }
    });

    this.container.addEventListener("contextmenu", (event) => {
      console.log(event.type);
      event.preventDefault();
      if (this.isStarted) {
        const [cell] = this.getCell(event);
        if (cell) {
          const svg = cell.querySelector("[data-cell-svg]");
          if (svg) {
            svg.remove();
          } else {
            cell.insertAdjacentHTML(
              "afterbegin",
              `<svg class="cell-svg cursor-pointer text-custom-background" fill="currentColor" data-cell-svg>
               <use xlink:href="#icon-danger"></use>
               </svg>`
            );
          }
        }
      }
    });
  }

  getMatrixValue(x, y) {
    return this.matrix[y][x];
  }

  setMatrixValue(x, y, value) {
    this.matrix[y][x] = value;
  }

  openMines() {
    this.minePositions.forEach(([x, y]) => {
      const node = this.getCellFromPosition(x, y);
      this.openCell(node, this.getMatrixValue(x, y));
      node.insertAdjacentHTML(
        "afterbegin",
        `<svg class="cell-svg text-custom-secondaryAccent" fill="currentColor">
               <use xlink:href="#icon-ghost"></use>
               </svg>`
      );
      this.container.classList.add("pointer-events-none");
    });
  }

  openAdjacentWhileEmpty(x, y) {
    const stack = [[x, y]];
    while (stack.length) {
      const [tempX, tempY] = stack.pop();
      const adjacents = this.getAdjacents(tempX, tempY);

      adjacents.forEach(([adjX, adjY]) => {
        const matrixItem = this.getMatrixValue(adjX, adjY);
        const node = this.getCellFromPosition(adjX, adjY);

        if (!node.disabled) {
          this.openCell(node, matrixItem);
          if (matrixItem === 0) {
            stack.push([adjX, adjY]);
          }
        }
      });
    }
  }

  openCell(node, matrixItem) {
    if (node.disabled) return;
    node.disabled = true;
    this.disabledCount += 1;

    if (this.disabledCount === this.maxDisabledCount) {
      this.handleWin();
    }
    node.textContent = "";
    if (matrixItem !== 0 && matrixItem !== "mine") {
      node.textContent = matrixItem;
    }
  }

  handleWin() {
    console.log("win!");
    this.container.classList.add("pointer-events-none");
  }

  handleFirstMove(x, y) {
    this.isStarted = true;
    const adjacents = this.getAdjacents(x, y);
    this.setEmptyStartingCells([[x, y], ...adjacents]);
    this.minePositions = this.getMinePositions(this.mineAmount, this.array, [
      [x, y],
      ...adjacents,
    ]);
    this.minePositions.forEach(([x, y]) => this.setMatrixValues(x, y));
  }

  setMatrixValues(x, y) {
    this.setMatrixValue(x, y, "mine");
    const adjacents = this.getAdjacents(x, y);
    adjacents.forEach(([adjX, adjY]) => {
      if (this.getMatrixValue(adjX, adjY) !== "mine") {
        this.setMatrixValue(adjX, adjY, this.getMatrixValue(adjX, adjY) + 1);
      }
    });
  }

  getCellFromPosition(x, y) {
    return this.cellNodes[`${x},${y}`];
  }

  setEmptyStartingCells(array) {
    array.forEach(([x, y]) => {
      this.setMatrixValue(x, y, 0);
    });
  }

  getMinePositions(mineAmount, array, emptyPositions) {
    const emptySet = new Set(emptyPositions.map(([x, y]) => `${x},${y}`));
    const mineSet = new Set();
    const positions = [];

    while (mineSet.size < mineAmount) {
      const flatPosition = getRandomNumber(array.length - 1);
      const x = flatPosition % this.cols;
      const y = Math.floor(flatPosition / this.cols);

      const posKey = `${x},${y}`;
      if (!emptySet.has(posKey) && !mineSet.has(posKey)) {
        mineSet.add(posKey);
        positions.push([x, y]);
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
      row.forEach((_, x) => {
        const cell = new Cell(x, y).getNode();
        this.container.appendChild(cell);
        this.cellNodes[`${x},${y}`] = cell;
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
    const selector = '[data-cell="true"]';
    let targetElement = event.target;

    console.log("event.target", targetElement);
    if (targetElement.tagName === "use") {
      targetElement = targetElement.closest("svg");
    }
    const cell = targetElement.closest(selector);

    if (cell) {
      const x = cell.getAttribute("data-xpos");
      const y = cell.getAttribute("data-ypos");
      return [cell, parseInt(x), parseInt(y)];
    } else {
      return null;
    }
  }
}
