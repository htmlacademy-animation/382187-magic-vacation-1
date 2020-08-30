import throttle from 'lodash/throttle';

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 2000;
    // this.prizes = document.querySelector(`.screen--prizes`);
    // this.story = document.querySelector(`.screen--story`);

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);
    this.animationBar = document.querySelector(`.animation-bar`);
    this.rulesLink = document.querySelector(`.rules__link`);


    this.storyScreenIndex = 1;
    this.prizeScreenIndex = 2;
    this.rulesScreenIndex = 3;

    this.activeScreen = 0;
    this.previousScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    const currentPosition = this.activeScreen;
    this.reCalculateActiveScreenPosition(evt.deltaY);
    if (currentPosition !== this.activeScreen) {
      this.changePageDisplay();
    }
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.previousScreen = this.activeScreen;
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    this.triggerAnimationBar();

    this.screenElements.forEach((screen) => {
      screen.classList.remove(`active`);
      screen.classList.add(`screen--hidden`);
    });

    if (this.previousScreen === this.rulesScreenIndex) {
      this.rulesLink.classList.remove(`active`);
    }

    if (!(this.previousScreen === this.storyScreenIndex && this.activeScreen === this.prizeScreenIndex)) {
      this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
      this.screenElements[this.activeScreen].classList.add(`active`);
    }
  }

  triggerAnimationBar() {
    if (this.previousScreen === this.storyScreenIndex && this.activeScreen === this.prizeScreenIndex) {
      this.screenElements[this.previousScreen].classList.add(`transitioning`);
    }

    this.animationBar.addEventListener(`transitionend`, () => {
      this.screenElements[this.storyScreenIndex].classList.remove(`transitioning`);
      this.screenElements[this.storyScreenIndex].classList.add(`screen--hidden`);
      this.screenElements[this.storyScreenIndex].classList.remove(`active`);

      this.animationBar.classList.remove(`active`);

      this.screenElements[this.prizeScreenIndex].classList.remove(`screen--hidden`);
      this.screenElements[this.prizeScreenIndex].classList.add(`active`);
    });
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}