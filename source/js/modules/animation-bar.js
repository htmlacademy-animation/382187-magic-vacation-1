export default () => {
  const animationBar = document.querySelector(`.animation-bar`);
  const menu = Array.from(document.querySelectorAll(`.js-menu-link`));
  const animationScreen = document.querySelector(`.animation-screen`);


  menu.forEach((elem) => {
    elem.addEventListener(`click`, function () {
      if (elem.dataset.href === `prizes`) {
        animationScreen.style.display = `none`;

        animationBar.addEventListener(`transitionend`, () => {
          animationBar.classList.remove(`active`);
        });

        animationBar.classList.add(`active`);
      } else if (elem.dataset.href !== `prizes`) {
        animationScreen.style.display = `flex`;
        animationBar.classList.remove(`active`);
      }
    });
  });
};
