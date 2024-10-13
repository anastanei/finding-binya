import { createWindows } from "./createWindows.js";
import { StartScreen } from "./start-screen.js";

createWindows();
new StartScreen(document.querySelector("[data-modal]"));
