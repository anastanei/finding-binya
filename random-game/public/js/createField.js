import { Component } from "./component.js";

export function createField(value) {
  const container = document.querySelector("[data-container]");
  const field = new Component({
    tag: "button",
    classes:
      "bg-custom-text text-custom-background select-none p-2 m-1/2 w-10 transition-colors duration-300 hover:bg-custom-accent active:bg-custom-background active:text-custom-text",
    attributes: {
      type: "button",
      "data-field": "true",
    },
    text: value,
  });
  container.appendChild(field.getNode());
}
