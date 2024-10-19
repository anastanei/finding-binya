import { createWindows } from './createWindows.js';
import { StartScreen } from './start-screen.js';
import { Music } from './music.js';
import { controlMuteButton } from './controlMuteButton.js';

const musicPlayer = new Music();
controlMuteButton(musicPlayer);
new StartScreen(document.querySelector('[data-modal]'), musicPlayer);
createWindows();
