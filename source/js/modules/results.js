import animateTrip from './seacalf-scene';
import animateFail from './crocodile-scene';

const startAnimation = ({createSvgAnimation, callback}) => {
  if (createSvgAnimation) {
    createSvgAnimation();
  }
  if (callback) {
    callback();
  }
};

const createScreen = (element, imgSrc) => {
  const img = document.createElement(`img`);
  img.src = imgSrc;
  const prevImg = element.querySelector(`img`);
  if (prevImg) {
    element.removeChild(prevImg);
  }
  element.append(img);
};

const showDefeatScreen = () => {
  const loseResultTitle = document.querySelector(`#result3 .result__title`);
  createScreen(loseResultTitle, `./img/lose-result.svg`);
};

const showSuccessScreen = () => {
  const winResultTitle = document.querySelector(`#result .result__title`);
  createScreen(winResultTitle, `./img/win-result.svg`);
};

export default {
  first: () => startAnimation({
    callback: animateTrip,
    createSvgAnimation: showSuccessScreen
  }),
  second: () => startAnimation({
  }),
  failure: () => startAnimation({
    callback: animateFail,
    createSvgAnimation: showDefeatScreen
  }),
};
