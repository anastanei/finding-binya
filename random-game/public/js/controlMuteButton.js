import { MuteHandler } from './muteHandler.js';

export function controlMuteButton(musicPlayer) {
  const muter = new MuteHandler();

  let isMuted = muter.get();

  const muteButton = document.querySelector('[data-sound-button]');
  const mutePath = muteButton.querySelector('[data-sound-mute-path]');
  const playPath = muteButton.querySelector('[data-sound-play-path]');
  const paths = [mutePath, playPath];

  const toggleVisibility = (node) => {
    node.classList.toggle('custom-hidden');
    node.classList.toggle('custom-visible');
  };

  if (isMuted) {
    paths.forEach((node) => toggleVisibility(node));
    musicPlayer.mute();
  }

  muteButton.addEventListener('click', () => {
    paths.forEach((node) => toggleVisibility(node));
    muter.toggle();
    isMuted = !isMuted;

    if (isMuted) {
      musicPlayer.mute();
    } else {
      musicPlayer.unmute();
    }
  });
}
