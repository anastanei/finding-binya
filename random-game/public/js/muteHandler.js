export class MuteHandler {
  constructor() {
    this.prefix = 'belialbehemothbeelzebub_mute-handler';
    this.isMuted = this.get();
  }

  save(isMuted) {
    this.isMuted = isMuted;
    localStorage.setItem(this.prefix + 'isMuted', JSON.stringify(isMuted));
  }

  get() {
    const state = localStorage.getItem(this.prefix + 'isMuted');
    return state ? JSON.parse(state) : false;
  }
  toggle() {
    this.isMuted = !this.isMuted;
    this.save(this.isMuted);
  }
}
