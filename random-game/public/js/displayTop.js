import { Component } from "./component.js";
import { StartScreen } from "./start-screen.js";

export function displayTop(modalEl, topResults) {
  modalEl.innerHTML = "";

  const headers = ["#", "Player", "Traps", "Date"];
  const headerRow = new Component(
    { tag: "tr", classes: "text-lg" },
    ...headers.map(
      (header) => new Component({ tag: "th", text: header, classes: "" })
    )
  );

  const resultRows = topResults.map((result, index) => {
    return new Component(
      { tag: "tr", classes: "text-base" },
      new Component({ tag: "td", text: `${index + 1}`, classes: "p-2" }),
      new Component({
        tag: "td",
        text: result.playerName,
        classes:
          "p-2 text-ellipsis max-w-[128px] overflow-hidden whitespace-nowrap",
      }),
      new Component({ tag: "td", text: `${result.mines}`, classes: "p-2" }),
      new Component({
        tag: "td",
        text: new Date(result.date).toLocaleDateString(),
        classes: "",
      })
    );
  });

  const table = new Component(
    { tag: "table", classes: "p-5" },
    headerRow,
    ...resultRows
  );

  const playAgainButton = new Component({
    tag: "button",
    text: "Play Again",
    classes:
      "dialog-button m-1 py-2 px-4 bg-custom-accent text-custom-background extend-click custom-bg-hover custom-bg-hover--accent",
  });

  playAgainButton.getNode().addEventListener("click", () => {
    modalEl.classList.add("custom-hidden");
    modalEl.classList.remove("custom-visible");
    new StartScreen(document.querySelector("[data-modal]"));
  });

  const inner = new Component({ tag: "div", classes: "" });

  inner.append(table);
  inner.append(playAgainButton);

  modalEl.appendChild(inner.getNode());
  modalEl.classList.remove("custom-hidden");
  modalEl.classList.add("custom-visible");
}
