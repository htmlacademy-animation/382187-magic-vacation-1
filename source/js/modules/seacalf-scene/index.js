import Plane from './plane';
import Seacalf from './seacalf';
import Snowflake from './snowflake';
import {animateDuration, runSerial} from '../helpers';

export default () => {
  const ANIMATION_DURATION = 1400;
  const TOTAL_DURATION = 3000;

  const canvasElement = document.getElementById(`seacalf-canvas`);
  let animate = false;
  let loadSeacalfCount = 0;

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
    if (!animate) {
      animate = true;

      const render = () => {
        ctx.save();
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        plane.draw();
        seacalf.draw();
        snowflakeLeft.draw();
        snowflakeRight.draw();

        ctx.restore();

        if (animate) {
          requestAnimationFrame(render);
        }
      };

      runSerial([
        () => seacalf.animate(),
        () => plane.animate(),
        () => snowflakeLeft.animate(),
        () => snowflakeRight.animate()
      ]);

      animateDuration(render, TOTAL_DURATION);
    }
  };

  const init = () => {
    const increaseLoadSeacalfImg = () => {
      loadSeacalfCount++;

      if (loadSeacalfCount === 7) {
        drawScene();
      }
    };

    seacalf.seacalf.img.onload = () => {
      increaseLoadSeacalfImg();
    };

    seacalf.ice.img.onload = () => {
      increaseLoadSeacalfImg();
    };

    plane.plane.img.onload = () => {
      increaseLoadSeacalfImg();
    };

    plane.leftTree.img.onload = () => {
      increaseLoadSeacalfImg();
    };

    plane.rightTree.img.onload = () => {
      increaseLoadSeacalfImg();
    };

    snowflakeLeft.snowflake.img.onload = () => {
      increaseLoadSeacalfImg();
    };

    snowflakeRight.snowflake.img.onload = () => {
      increaseLoadSeacalfImg();
    };
  };

  init();
};
