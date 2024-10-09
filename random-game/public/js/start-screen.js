import { Cell } from "./cell.js";
import { Minesweeper } from "./minesweeper.js";

export class StartScreen {
  constructor() {
    this.createGuide();
    this.setRangeValue("[data-range-cols]", "rangeInput-0", 5, 120);
    this.handleRangeChange("[data-range-cols]", "rangeInput-0");
    this.setRangeValue("[data-range-rows]", "rangeInput-1", 5, 120);
    this.handleRangeChange("[data-range-rows]", "rangeInput-1");

    new Minesweeper(5, 5, "[data-container]");
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

  setRangeValue(selector, rangeID, minValue, maxValue) {
    const rangeInput = document.querySelector(selector);
    const label = document.querySelector(`label[for="${rangeID}"]`);

    rangeInput.value = label.textContent = rangeInput.min = minValue;
    rangeInput.max = maxValue;
  }

  handleRangeChange(selector, rangeID) {
    const rangeInput = document.querySelector(selector);
    const label = document.querySelector(`label[for="${rangeID}"]`);

    rangeInput.addEventListener("input", (event) => {
      label.textContent = event.target.value;
    });
  }
}
