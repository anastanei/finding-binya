import { Component } from "./component.js";

export class Cell extends Component {
  constructor(x, y, attributes = {}) {
    const defaultClasses =
      "relative bg-custom-text text-custom-text shadow-custom-inset select-none disabled:shadow-none disabled:bg-custom-background p-1 m-1/2 min-w-6 min-h-6 transition-all duration-300 hover:bg-custom-accent hover:shadow-custom-inset-hover active:bg-custom-background active:shadow-none";
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
