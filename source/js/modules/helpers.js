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

// These values are established by empiricism with tests (tradeoff: performance VS precision)
const NEWTON_ITERATIONS = 4;
const NEWTON_MIN_SLOPE = 0.001;
const SUBDIVISION_PRECISION = 0.0000001;
const SUBDIVISION_MAX_ITERATIONS = 10;

const kSplineTableSize = 11;
const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

const float32ArraySupported = `Float32Array` in window;
// eslint-disable-next-line new-cap
function A(aA1, aA2) {
  return 1.0 - 3.0 * aA2 + 3.0 * aA1;
}
// eslint-disable-next-line new-cap
function B(aA1, aA2) {
  return 3.0 * aA2 - 6.0 * aA1;
}
// eslint-disable-next-line new-cap
function C(aA1) {
  return 3.0 * aA1;
}

// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
function calcBezier(aT, aA1, aA2) {
  // eslint-disable-next-line new-cap
  return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
}

// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
function getSlope(aT, aA1, aA2) {
  // eslint-disable-next-line new-cap
  return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
}

function binarySubdivide(aX, aA, aB) {
  let currentX;
  let currentT;
  let i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    // eslint-disable-next-line no-undef
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}

const bezierEasing = (mX1, mY1, mX2, mY2) => {
  if (mX1 < 0 || mX1 > 1 || mX2 < 0 || mX2 > 1) {
    throw new Error(`BezierEasing x values must be in [0, 1] range.`);
  }

  const mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

  function newtonRaphsonIterate(aX, aGuessT) {
    for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
      const currentSlope = getSlope(aGuessT, mX1, mX2);
      if (currentSlope === 0.0) {
        return aGuessT;
      }
      const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }

  function calcSampleValues() {
    for (let i = 0; i < kSplineTableSize; ++i) {
      mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }
  }

  function getTForX(aX) {
    let intervalStart = 0.0;
    let currentSample = 1;
    let lastSample = kSplineTableSize - 1;

    // eslint-disable-next-line eqeqeq
    for (; currentSample != lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    // Interpolate to provide an initial guess for t
    const dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample + 1] - mSampleValues[currentSample]);
    const guessForT = intervalStart + dist * kSampleStepSize;

    const initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
    }
  }

  let _precomputed = false;

  function precompute() {
    _precomputed = true;
    // eslint-disable-next-line eqeqeq
    if (mX1 != mY1 || mX2 != mY2) {
      calcSampleValues();
    }
  }

  const f = function (aX) {
    if (!_precomputed) {
      precompute();
    }
    if (mX1 === mY1 && mX2 === mY2) {
      return aX;
    } // linear
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (aX === 0) {
      return 0;
    }
    if (aX === 1) {
      return 1;
    }
    return calcBezier(getTForX(aX), mY1, mY2);
  };

  f.getControlPoints = function () {
    return [{x: mX1, y: mY1}, {x: mX2, y: mY2}];
  };

  const args = [mX1, mY1, mX2, mY2];
  const str = `BezierEasing("${args}")`;
  f.toString = function () {
    return str;
  };

  const css = `cubic-bezier("${args}")`;
  f.toCSS = function () {
    return css;
  };

  return f;
};

export {bezierEasing};
