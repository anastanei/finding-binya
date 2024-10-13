import { Cell } from "./cell.js";
import { Minesweeper } from "./minesweeper.js";
import { calculateFieldSize } from "./calculateFieldSize.js";
import { Component } from "./component.js";

export class StartScreen {
  constructor(modal) {
    this.modalEl = modal;
    this.modalEl.textContent = "";
    this.modalEl.classList.remove("custom-hidden");
    this.modalEl.classList.add("custom-visible");
    this.renderStartScreen();
    this.createGuide();

    const rangeInputCols = this.modalEl.querySelector("[data-range-cols]");
    const rangeInputRows = this.modalEl.querySelector("[data-range-rows]");
    const maxCol = calculateFieldSize();
    const maxRows = calculateFieldSize("height");

    this.setRangeValue(rangeInputCols, "rangeInput-0", 5, maxCol);
    this.handleRangeChange(rangeInputCols, "rangeInput-0");
    this.setRangeValue(rangeInputRows, "rangeInput-1", 5, maxRows);
    this.handleRangeChange(rangeInputRows, "rangeInput-1");

    const rangeInputMines = this.modalEl.querySelector("[data-range-mines]");
    this.setRangeValue(rangeInputMines, "rangeInput-2", 10, 35);
    this.handleRangeChange(rangeInputMines, "rangeInput-2");

    const form = this.modalEl.querySelector("[data-player-form]");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const cols = parseInt(rangeInputCols.value);
      const rows = parseInt(rangeInputRows.value);
      const mines = parseInt(rangeInputMines.value);
      const playerName = this.modalEl.querySelector("[data-player-name]").value;
      console.log(playerName);
      new Minesweeper(cols, rows, mines, "[data-container]", playerName);
      this.modalEl.classList.remove("custom-visible");
      this.modalEl.classList.add("custom-hidden");
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

  addPlayerLoginField() {
    const playerNameLabel = new Component({
      tag: "label",
      text: "Your name:",
      attributes: { for: "playerName" },
    });

    const playerNameInput = new Component({
      tag: "input",
      classes:
        "focus:outline-none focus:outline-custom-accent bg-transparent p-2",
      attributes: {
        type: "text",
        id: "playerName",
        "data-player-name": "",
        placeholder: "Enter your login",
        required: true,
        minlength: 3,
        maxlength: 15,
        pattern: "^[A-Za-zА-Яа-я0-9]+$",
        autocomplete: "off",
      },
    });

    playerNameInput.getNode().addEventListener("input", function () {
      if (this.validity.valueMissing) {
        this.setCustomValidity("Please enter your name.");
      } else if (this.validity.tooShort) {
        this.setCustomValidity("Name must be at least 3 characters long.");
      } else if (this.validity.tooLong) {
        this.setCustomValidity("Name must be no longer than 15 characters.");
      } else if (this.validity.patternMismatch) {
        this.setCustomValidity("Only letters and numbers are allowed.");
      } else {
        this.setCustomValidity("");
      }
    });

    const playerNameContainer = new Component(
      {
        tag: "div",
        classes: "flex flex-col gap-2",
      },
      playerNameLabel,
      playerNameInput
    );

    return playerNameContainer;
  }
  renderStartScreen() {
    // const videoSource = new Component({
    //   tag: "source",
    //   attributes: { src: "./public/video/cat_hides.webm", type: "video/webm" },
    // });
    // const video = new Component(
    //   {
    //     tag: "video",
    //     classes: "absolute bottom-5 left-1/2 w-1/2 block -translate-x-1/2",
    //     attributes: {
    //       height: "252",
    //       width: "320",
    //       autoplay: "true",
    //       loop: "true",
    //       muted: "true",
    //     },
    //   },
    //   videoSource
    // );

    const overlayBackground = new Component({
      tag: "div",
      classes: "absolute inset-0 h-full bg-custom-background opacity-80",
    });

    // const videoContainer = new Component(
    //   {
    //     tag: "div",
    //     classes: "absolute inset-0 h-full",
    //   },
    //   video,
    //   overlayBackground
    // );

    const title = new Component({
      tag: "h2",
      classes: "bigger-text font-semibold",
      text: "You've lost your cat Binya :(",
    });

    const text = new Component({
      tag: "p",
      text: "You need to find her, but the city is full of danger.",
    });

    const textContainer = new Component({ tag: "div" }, title, text);

    const instructions = [
      {
        text: "Click or tap on a safe cell to reveal a number. The number shows how many traps are next to it: ",
        spanAttributes: { "data-guide-number-cell": "" },
      },
      {
        text: "Right-click or long press to mark cells you think have traps: ",
        spanAttributes: { "data-guide-flagged-cell": "" },
      },
      {
        text: "If you click on a trap, you lose the game and won't find Binya!",
      },
      {
        text: "Find your cat by revealing all the safe cells!",
      },
    ];

    const listItems = instructions.map(({ text, spanAttributes }) => {
      const span = spanAttributes
        ? new Component({ tag: "span", attributes: spanAttributes })
        : null;
      return new Component({ tag: "li", text }, ...(span ? [span] : []));
    });

    const instructionsList = new Component(
      { tag: "ul", classes: "list-disc list-outside pl-2" },
      ...listItems
    );

    const fieldSetupItems = [
      {
        label: "Columns",
        id: "rangeInput-0",
        attributes: { "data-range-cols": "" },
      },
      {
        label: "Rows",
        id: "rangeInput-1",
        attributes: { "data-range-rows": "" },
      },
      {
        label: "Mines (%)",
        id: "rangeInput-2",
        attributes: { "data-range-mines": "", min: "10", max: "35" },
      },
    ];

    const fieldSetupElements = fieldSetupItems.flatMap(
      ({ label, id, attributes }) => {
        const labelComponent = new Component({ tag: "p", text: label });
        const inputComponent = new Component({
          tag: "input",
          classes: "custom-range-input",
          attributes: { type: "range", id, ...attributes },
        });
        const rangeLabelComponent = new Component({
          tag: "label",
          attributes: { for: id },
          text: "0",
        });
        return [labelComponent, inputComponent, rangeLabelComponent];
      }
    );

    const fieldSetupContainer = new Component(
      {
        tag: "div",
        classes: "grid grid-cols-[auto,_1fr,2rem] w-3/4 items-center gap-3",
      },
      ...fieldSetupElements
    );

    const svgIconPath = new Component({
      tag: "path",
      attributes: { d: "M8 5v14l11-7z" },
    });
    const svgIcon = new Component(
      {
        tag: "svg",
        classes: "w-4 h-4",
        attributes: {
          fill: "currentColor",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          stroke: "none",
        },
      },
      svgIconPath
    );
    const buttonText = new Component({
      tag: "span",
      classes: "text-custom-background",
      text: "start",
    });

    const startButton = new Component(
      {
        tag: "button",
        classes:
          "custom-bg-hover custom-bg-hover--accent bg-custom-accent text-custom-background py-2 px-6 mx-auto flex items-center justify-center space-x-2 extend-click",
        attributes: { "data-start-button": "", type: "submit" },
      },
      svgIcon,
      buttonText
    );

    const playerNameContainer = this.addPlayerLoginField();

    const formComponent = new Component(
      {
        tag: "form",
        classes: "flex flex-col items-start gap-4 w-full",
        attributes: { "data-player-form": "true" },
      },
      playerNameContainer,
      startButton
    );

    const modalContent = new Component(
      {
        tag: "div",
        classes:
          "relative p-8 w-full leading-normal max-w-lg flex flex-col items-start gap-6",
      },
      textContainer,
      instructionsList,
      new Component({
        tag: "h2",
        classes: "bigger-text",
        text: "Set up the field:",
      }),
      fieldSetupContainer,
      formComponent
    );

    // this.modalEl.appendChild(videoContainer.getNode());
    this.modalEl.appendChild(modalContent.getNode());
    document.querySelector("#playerName").focus();
  }
}
