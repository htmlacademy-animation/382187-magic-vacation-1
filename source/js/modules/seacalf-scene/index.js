import Plane from './plane';
import Seacalf from './seacalf';
import Snowflake from './snowflake';
import {animateDuration, animateProgress, runSerial, tick} from '../helpers';

export default () => {
  const ANIMATION_DURATION = 1800;
  const SNOWFLAKES_OPACITY_DURATION = 400;
  const canvasElement = document.getElementById(`seacalf-canvas`);
  const startAnimations = [];

  let loadSeacalfCount = 0;
  let opacity = 0;
  let animate = false;

  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;

  const ctx = canvasElement.getContext(`2d`);

  const seacalf = new Seacalf({duration: ANIMATION_DURATION, ctx});
  seacalf.initImages();

  const snowflakeLeft = new Snowflake({
    duration: ANIMATION_DURATION,
    ctx,
    position: {
      top: window.innerHeight / 2 + 20,
      left: window.innerWidth / 2 - 370,
    },
    skew: [-0.3, 0.3],
    scale: [1, 1],
  });
  snowflakeLeft.initImage();

  const snowflakeRight = new Snowflake({
    duration: ANIMATION_DURATION,
    ctx,
    position: {
      top: window.innerHeight / 2 + 80,
      left: window.innerWidth / 2 + 300,
    },
    skew: [0.3, -0.3],
    scale: [-0.7, 0.7],
  });
  snowflakeRight.initImage();

  const plane = new Plane({duration: ANIMATION_DURATION, ctx});
  plane.initImages();

  const drawScene = () => {
    ctx.save();
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    plane.draw();
    seacalf.draw();
    // Используем здесь для того чтобы анимация прозрачности у снежинок была только при первом запуске
    ctx.globalAlpha = opacity;
    snowflakeLeft.draw();
    snowflakeRight.draw();
    ctx.restore();
  };

  const opacityAnimationTick = (from, to) => (progress) => {
    opacity = tick(from, to, progress);
  };

  const startSnowflakesAnimationInfinite = () => {
    const globalAnimationTick = (globalProgress) => {
      if (globalProgress === 0) {
        // Не должно быть в серии
        // Анимация прорачности идет одновременно с анимацией движения
        animateProgress(opacityAnimationTick(opacity, 1), SNOWFLAKES_OPACITY_DURATION);

        runSerial([
          () => snowflakeLeft.animate(),
          () => snowflakeRight.animate()
        ]);
      }
      drawScene();
    };

    const animations = [
      () => animateDuration(globalAnimationTick, ANIMATION_DURATION)
    ];

    runSerial(animations).then(startSnowflakesAnimationInfinite);
  };


  const startAnimation = () => {
    if (!animate) {
      animate = true;

      const globalAnimationTick = (globalProgress) => {
        if (globalProgress >= 0 && startAnimations.indexOf(0) === -1) {
          startAnimations.push(0);
          seacalf.animate();
        }

        if (globalProgress >= 393 && startAnimations.indexOf(393) === -1) {
          startAnimations.push(393);
          plane.animate();
        }

        if (globalProgress >= 934 && startAnimations.indexOf(934) === -1) {
          startAnimations.push(934);
          startSnowflakesAnimationInfinite();
        }
      };
      animateDuration(globalAnimationTick, ANIMATION_DURATION);
    }
  };

  const increaseLoadSeacalfSceneImg = () => {
    loadSeacalfCount++;

    if (loadSeacalfCount === 7) {
      startAnimation();
    }
  };

  const init = () => {
    seacalf.seacalf.img.onload = () => {
      increaseLoadSeacalfSceneImg();
    };
    seacalf.ice.img.onload = () => {
      increaseLoadSeacalfSceneImg();
    };
    plane.plane.img.onload = () => {
      increaseLoadSeacalfSceneImg();
    };
    plane.leftTree.img.onload = () => {
      increaseLoadSeacalfSceneImg();
    };
    plane.rightTree.img.onload = () => {
      increaseLoadSeacalfSceneImg();
    };
    snowflakeLeft.snowflake.img.onload = () => {
      increaseLoadSeacalfSceneImg();
    };
    snowflakeRight.snowflake.img.onload = () => {
      increaseLoadSeacalfSceneImg();
    };
  };

  init();
};
