export const bounce = (timeFraction) => {
  // eslint-disable-next-line no-unused-vars, no-constant-condition
  for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
    if (timeFraction >= (7 - 4 * a) / 11) {
      return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2);
    }
  }
};

export const makeEaseOut = (func) => {
  return (timeFraction) => {
    return 1 - func(1 - timeFraction);
  };
};

export const animateEasing = (render, duration, easing) => new Promise((resolve) => {
  let start = Date.now();
  (function loop() {
    let p = (Date.now() - start) / duration;
    if (p > 1) {
      render(1);
      resolve();
    } else {
      requestAnimationFrame(loop);
      render(easing(p));
    }
  }());
});

export const animateProgress = (render, duration) => new Promise((resolve) => {
  let start = Date.now();
  (function loop() {
    let p = (Date.now() - start) / duration;
    if (p > 1) {
      render(1);
      resolve();
    } else {
      requestAnimationFrame(loop);
      render(p);
    }
  }());
});

// eslint-disable-arrow-parens
export const animateDuration = (render, duration) => new Promise((resolve) => {
  let start = Date.now();
  (function loop() {
    let p = Date.now() - start;
    if (p > duration) {
      render(duration);
      resolve();
    } else {
      requestAnimationFrame(loop);
      render(p);
    }
  }());
});

export const runSerial = (tasks) => {
  let result = Promise.resolve();
  tasks.forEach((task) => {
    result = result.then(task);
  });
  return result;
};

export const skewCtx = (ctx, x, y) => {
  ctx.transform(1, x, y, 1, 0, 0);
};

export const rotateCoords = (cx, cy, x, y, angle) => {
  const newX = (x - cx) * Math.cos(angle * Math.PI / 180) - (y - cy) * Math.sin(angle * Math.PI / 180) + cx;
  const newY = (x - cx) * Math.sin(angle * Math.PI / 180) + (y - cy) * Math.cos(angle * Math.PI / 180) + cy;
  return {x: newX, y: newY};
};

export const rotateCtx = (ctx, angle, cx, cy) => {
  ctx.translate(cx, cy);
  ctx.rotate(angle * Math.PI / 180);
  ctx.translate(-cx, -cy);
};

export const tick = (from, to, progress) => from + progress * (to - from);
