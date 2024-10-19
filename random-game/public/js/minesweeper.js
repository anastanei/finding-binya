import { getRandomNumber } from './getRandomNumber.js';
import { Cell } from './cell.js';
import { createDialog } from './createDialog.js';
import { saveResult } from './saveResult.js';

export class Minesweeper {
  constructor(cols, rows, mines, containerSelector, playerName, musicPlayer) {
    this.cols = cols;
    this.rows = rows;
    this.length = this.cols * this.rows;
    this.mineAmount = Math.round((this.length * mines) / 100);
    this.isStarted = false;
    this.disabledCount = 0;
    this.maxDisabledCount = this.length - this.mineAmount;
    this.container = document.querySelector(containerSelector);
    this.container.style.setProperty(
      'grid-template-columns',
      `repeat(${this.cols}, minmax(1.5rem, 1fr))`
    );
    this.reset();
    this.name = playerName;
    this.player = musicPlayer;
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

    this.showEl('[data-game-video]', false);
    this.hideEl('[data-win-video]');

    this.container.style.setProperty(
      'grid-template-columns',
      `repeat(${this.cols}, minmax(1.5rem, 1fr))`
    );

    this.init();
  }

  init() {
    this.array = Array(this.length).fill(0);
    this.matrix = this.getMatrix(this.array, this.cols);
    this.cellNodes = {};
    this.createEmptyField(this.matrix);

    let longPressTimeout;
    const longPressDuration = 100;

    this.container.addEventListener('click', (event) => {
      this.handleAction(event, false);
    });

    this.container.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      this.handleAction(event, true);
    });

    this.container.addEventListener('touchstart', (event) => {
      longPressTimeout = setTimeout(() => {
        this.handleAction(event, true);
      }, longPressDuration);
    });

    const resetLongPress = () => {
      clearTimeout(longPressTimeout);
    };

    this.container.addEventListener('touchend', resetLongPress);
    this.container.addEventListener('touchcancel', resetLongPress);
  }

  handleAction(event, isLongPress = false) {
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
        } else if (matrixItem === 'mine') {
          this.handleLosing();
        } else {
          this.openCell(node, matrixItem);
        }
      }
    }
  }

  handleContextMenu(cell) {
    const [node] = cell;
    const svg = node.querySelector('[data-cell-svg]');

    if (svg) {
      svg.remove();
    } else {
      node.insertAdjacentHTML(
        'afterbegin',
        `<svg class="cell-svg cursor-pointer text-custom-background" fill="currentColor" data-cell-svg>
         <use xlink:href="#icon-danger"></use>
       </svg>`
      );
    }
    this.blockCell(node);
  }

  blockCell(node) {
    node.style.pointerEvents = 'none';
    setTimeout(() => {
      node.style.pointerEvents = 'auto';
    }, 300);
  }

  handleFirstMove(x, y) {
    this.isStarted = true;
    const adjacents = this.getAdjacents(x, y);
    this.setEmptyStartingCells([[x, y], ...adjacents]);
    this.minePositions = this.getMinePositions(this.mineAmount, this.array, [
      [x, y],
      ...adjacents
    ]);
    this.minePositions.forEach(([x, y]) => this.setMatrixValues(x, y));
  }

  openMines() {
    this.minePositions.forEach(([x, y]) => {
      const node = this.getCellFromPosition(x, y);
      this.openCell(node, this.getMatrixValue(x, y), true);
      node.insertAdjacentHTML(
        'afterbegin',
        `<svg class="cell-svg text-custom-secondaryAccent" fill="currentColor">
        <use xlink:href="#icon-heart"></use>
        </svg>`
      );
      this.container.classList.add('pointer-events-none');
    });
  }

  openCell(node, matrixItem, isMine = false) {
    if (node.disabled) return;

    node.disabled = true;
    node.style.pointerEvents = 'none';

    if (!isMine) {
      this.disabledCount += 1;
    }

    node.textContent = '';

    if (!isMine && this.disabledCount === this.maxDisabledCount) {
      this.handleWin();
    }

    if (matrixItem !== 0 && matrixItem !== 'mine') {
      node.textContent = matrixItem;
    } else if (isMine) {
      node.insertAdjacentHTML(
        'afterbegin',
        `<svg class="cell-svg text-custom-secondaryAccent" fill="currentColor">
        <use xlink:href="#icon-heart"></use>
      </svg>`
      );
    }
  }

  checkDialog(status) {
    let dialogNode = document.querySelector('.dialog');
    const message = status === 'win' ? "You've won!" : "You've lost :(";

    if (dialogNode) {
      const messageElement = dialogNode.querySelector('.dialog-message');
      if (messageElement) {
        messageElement.textContent = message;
      }
    } else {
      dialogNode = createDialog(status, this.player);
      document.body.prepend(dialogNode);
    }
    return dialogNode;
  }

  handleLosing() {
    this.hideEl('[data-game-video]', false);
    this.openMines();
    const dialogNode = this.checkDialog('lose');
    dialogNode.showModal();
  }

  handleWin() {
    this.openMines();
    this.hideEl('[data-game-video]', false);
    this.showEl('[data-win-video]');
    saveResult(this.name, this.mineAmount);
    const dialogNode = this.checkDialog('win');
    dialogNode.showModal();
    this.container.classList.add('pointer-events-none');
  }

  showEl(selector, visible = true) {
    const el = document.querySelector(selector);
    el.classList.add('custom-visible');
    el.classList.remove('custom-hidden');

    if (visible) {
      el.classList.add('custom-visible');
      el.classList.remove('custom-hidden');
    } else {
      el.classList.remove('opacity-0');
      el.classList.add('opacity-100');
    }
  }

  hideEl(selector, visible = true) {
    const el = document.querySelector(selector);
    if (visible) {
      el.classList.add('custom-hidden');
      el.classList.remove('custom-visible');
    } else {
      el.classList.add('opacity-0');
      el.classList.remove('opacity-100');
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
    this.setMatrixValue(x, y, 'mine');
    const adjacents = this.getAdjacents(x, y);
    adjacents.forEach(([adjX, adjY]) => {
      if (this.getMatrixValue(adjX, adjY) !== 'mine') {
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
    this.container.classList.remove('pointer-events-none');
    this.container.textContent = '';

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
      [1, 1]
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
    if (targetElement.tagName === 'use') {
      targetElement = targetElement.closest('svg');
    }
    const cell = targetElement.closest(selector);

    if (cell) {
      const x = cell.getAttribute('data-xpos');
      const y = cell.getAttribute('data-ypos');
      return [cell, parseInt(x), parseInt(y)];
    } else {
      return null;
    }
  }
}
