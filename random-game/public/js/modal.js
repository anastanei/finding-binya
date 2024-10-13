export class Modal {
  constructor(selector) {
    this.modal = document.querySelector(selector);
  }

  show() {
    this.modal.classList.remove("custom-hidden");
    this.modal.classList.add("custom-visible");

    if (!document.body.contains(this.modal)) {
      document.body.appendChild(this.modal);
    }
  }

  hide() {
    this.modal.classList.remove("custom-visible");
    this.modal.classList.add("custom-hidden");
  }

  append(child) {
    this.modal.append(child);
  }

  clear() {
    this.modal.textContent = "";
  }
}
