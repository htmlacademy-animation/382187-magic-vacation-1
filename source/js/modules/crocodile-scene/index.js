import {animateDuration, runSerial} from '../helpers';
import Key from "./key";
import Thing from "./thing";
import Crocodile from "./crocodile";
import Tear from "./tear";

export default () => {
  const ANIMATION_DURATION = 1200;
  const ANIMATION_INFINITE = 1000;
  const canvasElement = document.getElementById(`crocodile-canvas`);
  const startAnimations = [];
  const loopAnimations = [];
  const ww = window.innerWidth;
  const wh = window.innerHeight;

  const things = {
    flamingoOptions: {
      src: `./img/flamingo.png`,
      sizes: {
        initial: {
          width: 9,
          height: 11
        },
        final: {
          width: 99,
          height: 111
        }
      },
      positions: {
        initial: {
          top: wh / 2 - 111 / 2,
          left: ww / 2 - 99 / 2,
        },
        final: {
          top: wh / 2 - 111 / 2,
          left: ww / 2 - 200,
        }
      }
    },
    watermelonOptions: {
      src: `./img/watermelon.png`,
      sizes: {
        initial: {
          width: 8,
          height: 6
        },
        final: {
          width: 80,
          height: 65
        }
      },
      positions: {
        initial: {
          top: wh / 2 - 65 / 2 + 120,
          left: ww / 2 - 80 / 2 - 20,
        },
        final: {
          top: wh / 2 - 65 / 2 + 120,
          left: ww / 2 - 80 / 2 - 200,
        }
      }
    },
    snowflakeOptions: {
      src: `./img/snowflake.png`,
      sizes: {
        initial: {
          width: 6,
          height: 8
        },
        final: {
          width: 67,
          height: 79
        }
      },
      positions: {
        initial: {
          top: wh / 2 - 79 / 2 + 70,
          left: ww / 2 - 67 / 2 + 20,
        },
        final: {
          top: wh / 2 - 79 / 2 + 90,
          left: ww / 2 - 67 / 2 + 180,
        }
      }
    },
    saturnOptions: {
      src: `./img/saturn.png`,
      sizes: {
        initial: {
          width: 12,
          height: 8
        },
        final: {
          width: 99,
          height: 76
        }
      },
      positions: {
        initial: {
          top: wh / 2 - 76 / 2 + 120,
          left: ww / 2 - 99 / 2 + 60,
        },
        final: {
          top: wh / 2 - 76 / 2 + 190,
          left: ww / 2 - 99 / 2 + 240,
        }
      }
    },
    leafOptions: {
      src: `./img/leaf.png`,
      sizes: {
        initial: {
          width: 9,
          height: 1
        },
        final: {
          width: 89,
          height: 109
        }
      },
      positions: {
        initial: {
          top: wh / 2 - 109 / 2 + 40,
          left: ww / 2 - 89 / 2 + 40,
        },
        final: {
          top: wh / 2 - 109 / 2 - 20,
          left: ww / 2 - 89 / 2 + 270,
        }
      }
    }
  };

  let loadCrocodileCount = 0;
  let animate = false;

  canvasElement.width = ww;
  canvasElement.height = wh;

  const ctx = canvasElement.getContext(`2d`);

  const key = new Key({duration: ANIMATION_DURATION, ctx, src: `./img/key.png`});
  const {flamingoOptions, watermelonOptions, snowflakeOptions, saturnOptions, leafOptions} = things;
  const flamingo = new Thing({duration: ANIMATION_DURATION, ctx, src: flamingoOptions.src, sizes: flamingoOptions.sizes, positions: flamingoOptions.positions});
  const watermelon = new Thing({duration: ANIMATION_DURATION, ctx, src: watermelonOptions.src, sizes: watermelonOptions.sizes, positions: watermelonOptions.positions});
  const snowflake = new Thing({duration: ANIMATION_DURATION, ctx, src: snowflakeOptions.src, sizes: snowflakeOptions.sizes, positions: snowflakeOptions.positions});
  const saturn = new Thing({duration: ANIMATION_DURATION, ctx, src: saturnOptions.src, sizes: saturnOptions.sizes, positions: saturnOptions.positions});
  const leaf = new Thing({duration: ANIMATION_DURATION, ctx, src: leafOptions.src, sizes: leafOptions.sizes, positions: leafOptions.positions});
  const crocodile = new Crocodile({duration: ANIMATION_DURATION * 0.2, ctx, src: `./img/crocodile.png`});
  const tear = new Tear({duration: ANIMATION_INFINITE, ctx, src: `./img/drop.png`});

  const drawScene = () => {
    ctx.save();
    ctx.clearRect(0, 0, ww, wh);
    key.draw();
    crocodile.draw();
    tear.draw();
    flamingo.draw();
    watermelon.draw();
    snowflake.draw();
    saturn.draw();
    leaf.draw();
    ctx.restore();
  };

  const startTearAnimationLoop = () => {
    const globalAnimationTick = (globalProgress) => {
      if (globalProgress === 0 && loopAnimations.length < 3) {
        loopAnimations.push(0);
        tear.animate();
      }
      drawScene();
    };

    const animations = [
      () => animateDuration(globalAnimationTick, ANIMATION_DURATION)
    ];

    runSerial(animations).then(startTearAnimationLoop);
  };

  const startAnimation = () => {
    if (!animate) {
      animate = true;

      const globalAnimationTick = (globalProgress) => {
        if (globalProgress >= 0 && startAnimations.indexOf(0) === -1) {
          startAnimations.push(0);
          key.animate();
          flamingo.animate();
          watermelon.animate();
          snowflake.animate();
          saturn.animate();
          leaf.animate();
        }

        if (globalProgress >= 932 && startAnimations.indexOf(932) === -1) {
          startAnimations.push(932);
          crocodile.animate();
          flamingo.animateFall();
          watermelon.animateFall();
          snowflake.animateFall();
          saturn.animateFall();
          leaf.animateFall();
        }

        drawScene();

        if (globalProgress >= 1200 && startAnimations.indexOf(1200) === -1) {
          startAnimations.push(1200);
          startTearAnimationLoop();
        }
      };

      animateDuration(globalAnimationTick, ANIMATION_DURATION);
    }
  };

  const increaseLoadCrocodileSceneImg = () => {
    loadCrocodileCount++;

    if (loadCrocodileCount === 7) {
      startAnimation();
    }
  };

  const init = () => {
    key.img.onload = () => {
      increaseLoadCrocodileSceneImg();
    };

    flamingo.img.onload = () => {
      increaseLoadCrocodileSceneImg();
    };

    watermelon.img.onload = () => {
      increaseLoadCrocodileSceneImg();
    };

    saturn.img.onload = () => {
      increaseLoadCrocodileSceneImg();
    };

    leaf.img.onload = () => {
      increaseLoadCrocodileSceneImg();
    };

    crocodile.img.onload = () => {
      increaseLoadCrocodileSceneImg();
    };

    tear.img.onload = () => {
      increaseLoadCrocodileSceneImg();
    };
  };

  init();

};
