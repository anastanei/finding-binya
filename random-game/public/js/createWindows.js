import { Component } from "./component.js";

export function createWindows() {
  const container = document.querySelector("[data-houses]");
  for (let i = 0; i < 5; i += 1) {
    const duplex = new Component({
      classes:
        "background-duplex grid grid-cols-[40%,45%] gap-[15%] place-items-center h-2/5",
    });
    for (let m = 0; m < 2; m += 1) {
      const window = new Component({
        classes:
          "background-window grid mb-3 grid-cols-2 grid-rows-2 gap-1 w-1/3 h-1/2",
      });
      for (let k = 0; k < 4; k += 1) {
        const area = new Component({
          classes:
            "window-area bg-custom-text transition-colors duration-500 ease-out w-full h-full",
        });
        window.append(area);
      }
      duplex.append(window);
    }
    container.appendChild(duplex.getNode());
  }
}
