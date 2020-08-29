export default class TypographyBuild {
  constructor(
      elementSelector,
      timer,
      classForActivate,
      property,
      animationStep,
      wordContainerClass,
      initialOffset = 0
  ) {
    this._TIME_SPACE = 100;

    this._elementSelector = elementSelector;
    this._timer = timer;
    this._classForActivate = classForActivate;
    this._property = property;
    this.animationStep = animationStep;
    this._element = document.querySelector(this._elementSelector);
    this._timeOffset = 0;
    this.initialOffset = initialOffset;
    this.wordContainerClass = wordContainerClass;

    this.prePareText();
  }

  shuffleIndex(index) {
    if (index % 3 === 1) {
      return index - 1;
    }

    if (index % 3 === 2) {
      return index + 1;
    }

    return index;
  }

  createElement(letter, animatingIndex) {
    const span = document.createElement(`span`);
    span.textContent = letter;

    this._timeOffset = this.initialOffset + animatingIndex * this.animationStep;
    span.style.transition = `${this._property} ${this._timer}ms ease ${this._timeOffset}ms`;

    return span;
  }

  prePareText() {
    if (!this._element) {
      return;
    }
    const parentFragment = document.createDocumentFragment();
    let wordFragment = document.createDocumentFragment();
    let wordContainer = document.createElement(`span`);
    wordContainer.classList.add(this.wordContainerClass);

    this._element.textContent.trim().split(``).map((letter, idx, arr) => {
      // Omit spaces and do not animate them
      if (letter !== ` `) {
        wordFragment.appendChild(this.createElement(letter, this.shuffleIndex(idx)));
      }
      // Handle space letter
      if (letter === ` `) {
        // Apend word to parent
        wordFragment.appendChild(document.createTextNode(`\u00A0`));
        wordContainer.appendChild(wordFragment);
        parentFragment.appendChild(wordContainer);

        // Create new word container and word fragment
        wordContainer = document.createElement(`span`);
        wordContainer.classList.add(this.wordContainerClass);
        wordFragment = document.createDocumentFragment();
      }
      // Add the last letter to word and then the word to parent
      if (idx === arr.length - 1) {
        wordContainer.appendChild(wordFragment);
        parentFragment.appendChild(wordContainer);
      }
    });

    this._element.innerHTML = ``;
    this._element.appendChild(parentFragment);
  }

  runAnimation() {
    if (!this._element) {
      return;
    }
    this._element.classList.add(this._classForActivate);
  }

  destroyAnimation() {
    this._element.classList.remove(this._classForActivate);
  }
}
