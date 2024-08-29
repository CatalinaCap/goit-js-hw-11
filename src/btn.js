export default class loadMoreBtn {
  constructor({ selector, isHidden = false }) {
    // Obține referința către butonul specificat de selector.
    this.button = this.getButton(selector);

    // Ascunde butonul dacă `isHidden` este setat la true.
    isHidden && this.hide();
  }

  getButton(selector) {
    // Returnează elementul din DOM care corespunde selectorului dat.
    return document.querySelector(selector);
  }

  enable() {
    // Activează butonul și schimbă textul acestuia la "Load More".
    this.button.disabled = false;
    this.button.textContent = 'Load More';
  }

  disable() {
    // Dezactivează butonul și schimbă textul acestuia la "Loading...".
    this.button.disabled = true;
    this.button.textContent = 'Loading...';
  }

  hide() {
    // Adaugă clasa 'hidden' la buton pentru a-l ascunde.
    this.button.classList.add('hidden');
  }

  show() {
    // Elimină clasa 'hidden' de pe buton pentru a-l afișa.
    this.button.classList.remove('hidden');
  }
}
