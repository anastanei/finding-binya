import { Component } from "./component.js";

export class Cell extends Component {
  constructor(x, y, attributes = {}, text = "", classes = "") {
    const defaultClasses =
      "relative hover:cursor-pointer active:translate-y-0.5 bg-custom-text inline-flex items-center justify-center text-custom-text shadow-custom-inset select-none p-1 m-1/2 min-w-6 min-h-6 transition-all duration-300 hover:bg-custom-accent hover:shadow-custom-inset-hover active:bg-custom-background active:shadow-none disabled:shadow-none disabled:bg-custom-background disabled:pointer-events-none";

    attributes["data-cell"] = true;
    attributes["data-xpos"] = x;
    attributes["data-ypos"] = y;

    const combinedClasses = classes
      ? `${defaultClasses} ${classes}`
      : defaultClasses;

    super({
      tag: "button",
      classes: combinedClasses,
      attributes,
      text: text,
    });
  }
}
