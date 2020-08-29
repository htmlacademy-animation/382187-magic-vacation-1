import TypographyBuild from './typography-build.js';

export default () => {
  const ANIMATION_STEP = 20;
  const screenTopTitle = document.querySelector(`.intro__title`).textContent;
  const animatingOffset = screenTopTitle.replace(/\s/g, ``).length * ANIMATION_STEP;

  const animationTopScreenTitleLine = new TypographyBuild(`.intro__title`, 700, `active`, `transform`, ANIMATION_STEP, `intro__word`);
  setTimeout(() => {
    animationTopScreenTitleLine.runAnimation();
  }, 500);

  const animationTopScreenTextLine = new TypographyBuild(`.intro__date`, 500, `active`, `transform`, ANIMATION_STEP, `intro__date-word`, animatingOffset);
  setTimeout(() => {
    animationTopScreenTextLine.runAnimation();
  }, 500);

};
