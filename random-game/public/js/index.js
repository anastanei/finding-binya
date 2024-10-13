import { createWindows } from "./createWindows.js";
import { Modal } from "./modal.js";
import { StartScreen } from "./start-screen.js";
const modalSelector = "[data-modal]";

createWindows();
// const modalEl = ;
// const modal = new Modal(modalSelector);
new StartScreen(document.querySelector(modalSelector));
