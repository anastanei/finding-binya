import { Component } from "./component.js";

export class Cell extends Component {
  constructor(x, y, attributes = {}) {
    const defaultClasses =
      "bg-custom-text text-custom-text flex items-center justify-center shadow-custom-inset select-none disabled:shadow-none disabled:bg-custom-background p-1 m-1/2 min-w-6 min-h-6 transition-all duration-300 hover:bg-custom-accent active:bg-custom-background active:shadow-none";
    attributes["data-cell"] = true;
    attributes["data-xpos"] = x;
    attributes["data-ypos"] = y;

    super({
      tag: "button",
      classes: defaultClasses,
      attributes,
    });
  }
}
