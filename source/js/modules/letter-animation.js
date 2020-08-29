import TypographyBuild from './typography-build.js';

export default () => {
  const screenTopTitle = document.querySelector(`.intro__title`).textContent;
  const animatingOffset = screenTopTitle.trim().split(` `).join(``).split(``).length * 20;

  const animationTopScreenTitleLine = new TypographyBuild(`.intro__title`, 700, `active`, `transform`, `intro__word`);
  setTimeout(() => {
    animationTopScreenTitleLine.runAnimation();
  }, 500);

  const animationTopScreenTextLine = new TypographyBuild(`.intro__date`, 500, `active`, `transform`, `intro__date-word`, animatingOffset);
  setTimeout(() => {
    animationTopScreenTextLine.runAnimation();
  }, 500);

};
