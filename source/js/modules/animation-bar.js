export default () => {
  const animationBar = document.querySelector(`.animation-bar`);
  const menu = Array.from(document.querySelectorAll(`.js-menu-link`));
  const prizes = document.querySelector(`.screen--prizes`);
  const story = document.querySelector(`.screen--story`);


  animationBar.addEventListener(`transitionend`, () => {
    story.classList.remove(`transtioning`);
    story.classList.add(`screen--hidden`);
    story.classList.remove(`active`);

    animationBar.classList.remove(`active`);

    prizes.classList.remove(`screen--hidden`);
    prizes.classList.add(`active`);
  });

  menu.forEach((elem) => {
    elem.addEventListener(`click`, function () {
      if (elem.dataset.href !== `prizes`) {
        prizes.classList.add(`screen--hidden`);
        prizes.classList.remove(`active`);
      }
    });
  });
};
