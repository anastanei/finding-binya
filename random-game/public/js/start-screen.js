import { Cell } from "./cell.js";
import { Minesweeper } from "./minesweeper.js";
import { calculateFieldSize } from "./calculateFieldSize.js";

export class StartScreen {
  constructor() {
    this.createGuide();

    const startScreen = document.querySelector("[data-start-screen]");
    const rangeInputCols = startScreen.querySelector("[data-range-cols]");
    const rangeInputRows = startScreen.querySelector("[data-range-rows]");
    const maxCol = calculateFieldSize();
    const maxRows = calculateFieldSize("height");

    this.setRangeValue(rangeInputCols, "rangeInput-0", 5, maxCol);
    this.handleRangeChange(rangeInputCols, "rangeInput-0");
    this.setRangeValue(rangeInputRows, "rangeInput-1", 5, maxRows);
    this.handleRangeChange(rangeInputRows, "rangeInput-1");

    // this.setRangeValue(rangeInputRows, "rangeInput-1", 5, maxRows);
    const rangeInputMines = startScreen.querySelector("[data-range-mines]");
    this.handleRangeChange(rangeInputMines, "rangeInput-2");

    const startButton = startScreen.querySelector("[data-start-button]");
    startButton.addEventListener("click", (event) => {
      const cols = parseInt(rangeInputCols.value);
      const rows = parseInt(rangeInputRows.value);
      const mines = parseInt(rangeInputMines.value);
      new Minesweeper(cols, rows, mines, "[data-container]");
      startScreen.classList.remove("custom-visible");
      startScreen.classList.add("custom-hidden");
    });
  }

  createGuide() {
    const numberCellWrapper = document.querySelector(
      "[data-guide-number-cell]"
    );
    const cellClasses = "text-xs align-text-top sm:align-bottom w-6 h-6";
    const numberCell = new Cell(null, null, {}, 1, cellClasses).getNode();
    numberCell.disabled = true;
    numberCellWrapper.appendChild(numberCell);
    numberCell.classList.add("border-custom-text", "border-2", "border-solid");

    const flaggedCellWrapper = document.querySelector(
      "[data-guide-flagged-cell]"
    );
    const flaggedCell = new Cell(null, null, {}, "", cellClasses).getNode();
    flaggedCell.insertAdjacentHTML(
      "afterbegin",
      `<svg class="cell-svg cursor-pointer text-custom-background" fill="currentColor" data-cell-svg>
               <use xlink:href="#icon-danger"></use>
               </svg>`
    );
    flaggedCell.classList.add("pointer-events-none");
    flaggedCellWrapper.appendChild(flaggedCell);
  }

  setRangeValue(rangeInput, rangeID, minValue, maxValue) {
    const label = document.querySelector(`label[for="${rangeID}"]`);

    rangeInput.value = label.textContent = rangeInput.min = minValue;
    rangeInput.max = maxValue;
  }

  handleRangeChange(rangeInput, rangeID) {
    const label = document.querySelector(`label[for="${rangeID}"]`);

    rangeInput.addEventListener("input", (event) => {
      label.textContent = event.target.value;
    });
  }
}
