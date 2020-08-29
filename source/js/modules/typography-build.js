export default class TypographyBuild {
  constructor(
      elementSelector,
      timer,
      classForActivate,
      property,
      wordContainerClass,
      initialOffset = 0
  ) {
    this._TIME_SPACE = 100;

    this._elementSelector = elementSelector;
    this._timer = timer;
    this._classForActivate = classForActivate;
    this._property = property;
    this._element = document.querySelector(this._elementSelector);
    this._timeOffset = 0;
    this.initialOffset = initialOffset;
    this.wordContainerClass = wordContainerClass;

    this.prePareText();
  }

  shuffleArrayIndexes(array) {
    const shuffledArray = [];
    let i = 1;
    let j = 2;

    for (let index = 0; index < array.length; index++) {
      if (index === i) {
        shuffledArray.push(i + 1);
        i += 3;
      } else if (index === j) {
        shuffledArray.push(j - 1);
        j += 3;
      } else {
        shuffledArray.push(index);
      }
    }

    return shuffledArray.filter((e) => e === 0 || e);
  }

  createElement(letter, animatingIndex) {
    const span = document.createElement(`span`);
    span.textContent = letter;

    this._timeOffset = this.initialOffset + animatingIndex * 20;

    span.style.transition = `${this._property} ${this._timer}ms ease ${this._timeOffset}ms`;
    return span;
  }

  prePareText() {
    if (!this._element) {
      return;
    }
    const text = this._element.textContent.trim().split(` `).filter((letter) => letter !== ``);

    const content = text.reduce((fragmentParent, word) => {
      const animatingIndexes = this.shuffleArrayIndexes(word.split(``));
      const wordElement = Array.from(word).reduce((fragment, letter, idx) => {
        fragment.appendChild(this.createElement(letter, animatingIndexes[idx]));
        return fragment;
      }, document.createDocumentFragment());
      const wordContainer = document.createElement(`span`);
      wordContainer.classList.add(this.wordContainerClass);
      wordContainer.appendChild(wordElement);

      fragmentParent.appendChild(wordContainer);

      return fragmentParent;
    }, document.createDocumentFragment());


    this._element.innerHTML = ``;
    this._element.appendChild(content);
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
