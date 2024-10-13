import { createWindows } from "./createWindows.js";
import { StartScreen } from "./start-screen.js";

new StartScreen(document.querySelector("[data-modal]"));
createWindows();
