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
      console.log(event.type);
      const cell = this.getCell(event);
      if (cell) {
        const [node, x, y] = cell;
        if (!this.isStarted) {
          this.handleFirstMove(x, y);
        }

        const matrixItem = this.matrix[y][x];
        if (matrixItem === 0) {
          this.openCell(node, this.matrix[y][x]);
          this.openAdjacentWhileEmpty(x, y);
        } else if (matrixItem === "mine") {
          this.openMines();
        } else {
          this.openCell(node, this.matrix[y][x]);
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
              `<svg class="cell-svg text-custom-background" fill="currentColor" data-cell-svg>
               <use xlink:href="#icon-danger"></use>
               </svg>`
            );
          }
        }
      }
    });
  }

  openMines() {
    this.minePositions.forEach(([x, y]) => {
      const node = this.getCellFromPosition(x, y);
      this.openCell(node, this.matrix[y][x]);
      node.insertAdjacentHTML(
        "afterbegin",
        `<svg class="cell-svg text-custom-secondaryAccent" fill="currentColor">
               <use xlink:href="#icon-ghost"></use>
               </svg>`
      );
      // node.classList.add("text-custom-accent");
      this.container.classList.add("pointer-events-none");
    });
  }

  openAdjacentWhileEmpty(x, y) {
    const adjacents = this.getAdjacents(x, y);
    adjacents.forEach(([x, y]) => {
      const matrixItem = this.matrix[y][x];
      const node = this.getCellFromPosition(x, y);
      if (matrixItem === 0) {
        if (node.disabled === false) {
          this.openCell(node, matrixItem);
          this.openAdjacentWhileEmpty(x, y);
        }
      }
      if (matrixItem !== "mine") {
        this.openCell(node, matrixItem);
      }
    });
  }

  openCell(node, matrixItem) {
    matrixItem;
    node.textContent = "";
    if (matrixItem !== 0 && matrixItem !== "mine") {
      node.textContent = matrixItem;
    }
    node.disabled = true;
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
    this.matrix[y][x] = "mine";
    const adjacents = this.getAdjacents(x, y);
    adjacents.forEach(([x, y]) => {
      if (this.matrix[y][x] !== "mine") {
        this.matrix[y][x] += 1;
      }
    });
  }

  getCellFromPosition(x, y) {
    return this.container.querySelector(`[data-xpos="${x}"][data-ypos="${y}"]`);
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
