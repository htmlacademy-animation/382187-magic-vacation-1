export default () => {
  const rulesItem = document.querySelector(`.rules__item:last-child`);
  const rulesLink = document.querySelector(`.rules__link`);

  // TODO. FIX bug when link animated before list when we return on that screen

  rulesItem.addEventListener(`animationstart`, (event) => {
    if (event.animationName === `rulesItemText`) {
      rulesLink.classList.remove(`active`);
    }
  });
  rulesItem.addEventListener(`animationend`, (event) => {
    if (event.animationName === `rulesItemText`) {
      rulesLink.classList.add(`active`);
    }
  });
};
