import Plane from './plane';
import Seacalf from './seacalf';
import Snowflake from './snowflake';
import {animateDuration, runSerial} from '../helpers';

export default () => {
  const ANIMATION_DURATION = 1400;
  const TOTAL_DURATION = 3000;

  let animate = false;

  const drawScene = () => {
    if (!animate) {
      animate = true;

      const canvasElement = document.getElementById(`seacalf-canvas`);
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

  drawScene();
};
