import { getRandomNumber } from "./getRandomNumber.js";
import { Cell } from "./cell.js";
import { createDialog } from "./createDialog.js";
import { saveResult } from "./saveResult.js";

export class Minesweeper {
  constructor(cols, rows, mines, containerSelector, playerName) {
    this.cols = cols;
    this.rows = rows;
    this.length = this.cols * this.rows;
    this.mineAmount = Math.round((this.length * mines) / 100);
    this.isStarted = false;
    this.disabledCount = 0;
    this.maxDisabledCount = this.length - this.mineAmount;
    this.container = document.querySelector(containerSelector);
    this.container.style.setProperty(
      "grid-template-columns",
      `repeat(${this.cols}, minmax(1.5rem, 1fr))`
    );
    this.reset();
    this.name = playerName;
  }

  reset() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    this.array = [];
    this.matrix = [];
    this.cellNodes = {};
    this.minePositions = [];
    this.isStarted = false;
    this.disabledCount = 0;
    this.maxDisabledCount = this.length - this.mineAmount;

    const newContainer = this.container.cloneNode(true);
    this.container.replaceWith(newContainer);
    this.container = newContainer;

    this.showEl("[data-game-video]", false);
    this.hideEl("[data-win-video]");

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

    let touchStartTime = 0;
    let longPressTimeout;
    const longPressDuration = 300;

    const handleAction = (event, isLongPress = false) => {
      const cell = this.getCell(event);
      if (cell) {
        const [node, x, y] = cell;

        if (isLongPress) {
          this.handleContextMenu(cell);
        } else {
          if (!this.isStarted) {
            this.handleFirstMove(x, y);
          }
          const matrixItem = this.getMatrixValue(x, y);
          if (matrixItem === 0) {
            this.openCell(node, matrixItem);
            this.openAdjacentWhileEmpty(x, y);
          } else if (matrixItem === "mine") {
            this.handleLosing();
          } else {
            this.openCell(node, matrixItem);
          }
        }
      }
    };

    this.container.addEventListener("click", (event) => {
      handleAction(event, false);
    });

    this.container.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      handleAction(event, true);
    });

    this.container.addEventListener("touchstart", (event) => {
      touchStartTime = Date.now();
      longPressTimeout = setTimeout(() => {
        handleAction(event, true);
      }, longPressDuration);
    });

    this.container.addEventListener("touchend", (event) => {
      clearTimeout(longPressTimeout);
      if (Date.now() - touchStartTime < longPressDuration) {
        handleAction(event, false);
      }
    });

    this.container.addEventListener("touchmove", () => {
      clearTimeout(longPressTimeout);
    });
  }

  handleContextMenu(cell) {
    const [node] = cell;
    const svg = node.querySelector("[data-cell-svg]");

    if (svg) {
      svg.remove();
    } else {
      node.insertAdjacentHTML(
        "afterbegin",
        `<svg class="cell-svg cursor-pointer text-custom-background" fill="currentColor" data-cell-svg>
         <use xlink:href="#icon-danger"></use>
       </svg>`
      );
    }
    this.blockCell(node);
  }

  blockCell(node) {
    node.style.pointerEvents = "none";
    setTimeout(() => {
      node.style.pointerEvents = "auto";
    }, 300);
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

  openMines() {
    this.minePositions.forEach(([x, y]) => {
      const node = this.getCellFromPosition(x, y);
      this.openCell(node, this.getMatrixValue(x, y), true);
      node.insertAdjacentHTML(
        "afterbegin",
        `<svg class="cell-svg text-custom-secondaryAccent" fill="currentColor">
        <use xlink:href="#icon-heart"></use>
        </svg>`
      );
      this.container.classList.add("pointer-events-none");
    });
  }

  openCell(node, matrixItem, isMine = false) {
    if (node.disabled) return;
    node.disabled = true;
    if (!isMine) {
      this.disabledCount += 1;
    }

    node.textContent = "";
    if (this.disabledCount === this.maxDisabledCount) {
      node.classList.remove("disabled:bg-custom-background");
      node.classList.add("disabled:bg-custom-accent");
      node.insertAdjacentHTML(
        "afterbegin",
        `<svg class="cell-svg cursor-pointer text-black" version="1.0" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512" fill="currentColor">
        <path d="M481.875,299.344L512,292.219l-4.656-19.641l-24.25,5.734c0-0.328,0.016-0.641,0.016-0.969 c0-38.078-10.531-72.781-28.969-102.359c15.438-53.938-13.438-124.547-13.438-124.547S387.813,73,357.719,100.297 C327.109,91.063,292.578,88.094,256,88.094c-36.766,0-71.484,2.563-102.203,11.781c-30.156-27.109-82.5-49.438-82.5-49.438 S42.406,121.063,57.859,175c-18.422,29.578-28.984,64.281-28.984,102.344c0,0.328,0.031,0.641,0.031,0.969l-24.25-5.734L0,292.219 l30.109,7.125c2.672,23.578,9.672,44.75,20.234,63.422L12.875,377.75l7.484,18.75l41.203-16.484 c39.797,53.141,111.969,81.547,194.438,81.547c82.453,0,154.641-28.406,194.438-81.547l41.203,16.484l7.484-18.75l-37.469-14.984 C472.219,344.094,479.219,322.922,481.875,299.344z"/>
        </svg>`
      );
      this.disabledCount = 0;
      this.handleWin();
    } else if (matrixItem !== 0 && matrixItem !== "mine") {
      node.textContent = matrixItem;
    }
  }

  checkDialog(status) {
    let dialogNode = document.querySelector(".dialog");
    const message = status === "win" ? "You've won!" : "You've lost :(";

    if (dialogNode) {
      const messageElement = dialogNode.querySelector(".dialog-message");
      if (messageElement) {
        messageElement.textContent = message;
      }
    } else {
      dialogNode = createDialog(status);
      document.body.prepend(dialogNode);
    }
    return dialogNode;
  }

  handleLosing() {
    this.hideEl("[data-game-video]", false);
    this.openMines();
    const dialogNode = this.checkDialog("lose");
    dialogNode.showModal();
  }

  handleWin() {
    this.openMines();
    this.hideEl("[data-game-video]", false);
    this.showEl("[data-win-video]");
    saveResult(this.name, this.mineAmount);
    const dialogNode = this.checkDialog("win");
    dialogNode.showModal();
    this.container.classList.add("pointer-events-none");
  }

  showEl(selector, visible = true) {
    const el = document.querySelector(selector);
    el.classList.add("custom-visible");
    el.classList.remove("custom-hidden");

    if (visible) {
      el.classList.add("custom-visible");
      el.classList.remove("custom-hidden");
    } else {
      el.classList.remove("opacity-0");
      el.classList.add("opacity-100");
    }
  }

  hideEl(selector, visible = true) {
    const el = document.querySelector(selector);
    if (visible) {
      el.classList.add("custom-hidden");
      el.classList.remove("custom-visible");
    } else {
      el.classList.add("opacity-0");
      el.classList.remove("opacity-100");
    }
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

  setMatrixValues(x, y) {
    this.setMatrixValue(x, y, "mine");
    const adjacents = this.getAdjacents(x, y);
    adjacents.forEach(([adjX, adjY]) => {
      if (this.getMatrixValue(adjX, adjY) !== "mine") {
        this.setMatrixValue(adjX, adjY, this.getMatrixValue(adjX, adjY) + 1);
      }
    });
  }

  getMatrixValue(x, y) {
    return this.matrix[y][x];
  }

  setMatrixValue(x, y, value) {
    this.matrix[y][x] = value;
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
    this.container.classList.remove("pointer-events-none");
    this.container.textContent = "";

    matrix.forEach((row, y) => {
      row.forEach((_, x) => {
        const cell = new Cell(x, y).getNode();
        this.container.appendChild(cell);
        this.cellNodes[`${x},${y}`] = cell;

        cell.addEventListener("click", (event) => {
          this.handleCellAction(event, false);
        });

        cell.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          this.handleCellAction(event, true);
        });

        let touchStartTime = 0;
        let longPressTimeout;
        const longPressDuration = 500;

        cell.addEventListener("touchstart", (event) => {
          touchStartTime = Date.now();
          longPressTimeout = setTimeout(() => {
            this.handleCellAction(event, true);
          }, longPressDuration);
        });

        cell.addEventListener("touchend", (event) => {
          clearTimeout(longPressTimeout);
          if (Date.now() - touchStartTime < longPressDuration) {
            this.handleCellAction(event, false);
          }
        });

        cell.addEventListener("touchmove", () => {
          clearTimeout(longPressTimeout);
        });
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
