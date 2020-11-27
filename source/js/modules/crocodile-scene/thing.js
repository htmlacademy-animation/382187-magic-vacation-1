import {animateProgress, animateEasing, bezierEasing, tick} from '../helpers';

export default class Thing {
  constructor({duration, ctx, src, sizes, positions}) {
    this.duration = duration;
    this.ctx = ctx;

    this.initialSize = sizes.initial;
    this.finalSize = sizes.final;

    this.img = new Image();
    this.img.src = src;

    this.initialPositions = positions.initial;

    this.positions = positions.initial;

    this.finalPositions = positions.final;
  }

  positionAnimationTick(from, to) {
    return (progress) => {
      this.positions.left = tick(from.left, to.left, progress);
      this.positions.top = tick(from.top, to.top, progress);
    };
  }

  sizeAnimationTick(from, to) {
    return (progress) => {
      this.initialSize.width = tick(from.width, to.width, progress);
      this.initialSize.height = tick(from.height, to.height, progress);
    };
  }

  draw() {
    this.ctx.save();
    this.ctx.drawImage(this.img, this.positions.left, this.positions.top, this.initialSize.width, this.initialSize.height);
    this.ctx.restore();
  }

  animateFall() {
    animateEasing(this.positionAnimationTick(this.finalPositions, {...this.finalPositions, top: window.innerHeight}), this.duration * 0.7, bezierEasing(0.67, 1.07, 1, 1));
  }

  animate() {
    animateProgress(this.sizeAnimationTick(this.initialSize, this.finalSize), this.duration * 0.8);
    animateProgress(this.positionAnimationTick(this.initialPositions, this.finalPositions), this.duration);
  }
}
