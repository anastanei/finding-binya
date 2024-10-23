export class Music {
  constructor() {
    this.audio = new Audio();
    this.audio.src = './public/audio/listen.mp3';
    this.audio.loop = true;
    this.audio.volume = 0.1;
    this.audio.style.display = 'none';
    document.body.appendChild(this.audio);
    this.defaultVolume = 0.1;
  }

  playMusic() {
    this.audio.currentTime = 0;
    if (this.audio.paused) {
      this.audio.play();
    }
  }

  stopMusic() {
    this.audio.pause();
  }

  mute() {
    this.audio.muted = true;
    // this.audio.volume = 0;
  }

  unmute() {
    this.audio.muted = false;
    // this.audio.volume = this.defaultVolume;
  }
}
