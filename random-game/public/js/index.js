import { Minesweeper } from "./minesweeper.js";
import { StartScreen } from "./start-screen.js";

new StartScreen();
new Minesweeper(5, 5, "[data-container]");
