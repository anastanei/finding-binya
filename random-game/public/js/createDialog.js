import { Component } from "./component.js";
import { StartScreen } from "./start-screen.js";
import { getTop } from "./getTop.js";
import { displayTop } from "./displayTop.js";

export function createDialog(status) {
  const message = status === "win" ? "You've won!" : "You've lost:(";

  const dialog = new Component({
    tag: "dialog",
    classes:
      "dialog bg-custom-background bg-opacity-80 text-custom-text p-5 text-center w-fit select-none",
  });

  const messageElement = new Component({
    tag: "p",
    text: message,
    classes: "dialog-message text-lg mb-5",
  });

  const watchLeadersButton = new Component({
    tag: "button",
    text: "Watch leaders table",
    classes:
      "dialog-button m-1 py-2 px-4 bg-custom-text text-custom-background extend-click custom-bg-hover",
  });

  const tryAgainButton = new Component({
    tag: "button",
    text: "Try again",
    classes:
      "dialog-button m-1 py-2 px-4 bg-custom-accent text-custom-background extend-click custom-bg-hover custom-bg-hover--accent",
  });

  tryAgainButton.getNode().addEventListener("click", () => {
    dialog.getNode().close();
    new StartScreen(document.querySelector("[data-modal]"));
  });

  watchLeadersButton.getNode().addEventListener("click", () => {
    const topResults = getTop();
    dialog.getNode().close();
    displayTop(document.querySelector("[data-modal]"), topResults);
  });

  dialog.append(messageElement, watchLeadersButton, tryAgainButton);

  return dialog.getNode();
}
