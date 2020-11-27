import {animateProgress, runSerial, tick} from '../helpers';

export default class Tear {
  constructor({duration, ctx, src}) {
    this.duration = duration;
    this.ctx = ctx;
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;

    this.img = new Image();
    this.img.src = src;

    this.initialSize = {
      width: 8,
      height: 12
    };

    this.size = {
      width: 8,
      height: 12
    };

    this.finalSize = {
      width: 30,
      height: 42
    };

    this.initialPosition = {
      top: this.wh / 2 - this.finalSize.height / 2 + 160,
      left: this.ww / 2 - this.finalSize.width / 2 - 20,
    };

    this.position = {
      top: this.wh / 2 - this.finalSize.height / 2 + 160,
      left: this.ww / 2 - this.finalSize.width / 2 - 20,
    };

    this.finalPosition = {
      top: this.wh / 2 - this.finalSize.height / 2 + 215,
      left: this.ww / 2 - this.finalSize.width / 2 - 20,
    };

    this.opacity = 0;
  }

  sizeAnimationTick(from, to) {
    return (progress) => {
      this.size.width = tick(from.width, to.width, progress);
      this.size.height = tick(from.height, to.height, progress);
    };
  }

  positionYAnimationTick(from, to) {
    return (progress) => {
      this.position.top = tick(from.top, to.top, progress);
    };
  }

  opacityAnimationTick(from, to) {
    return (progress) => {
      this.opacity = tick(from, to, progress);
    };
  }

  draw() {
    this.ctx.save();
    this.ctx.globalAlpha = this.opacity;
    this.ctx.drawImage(this.img, this.position.left, this.position.top, this.size.width, this.size.height);
    this.ctx.restore();
  }

  animate() {
    runSerial([
      () => {
        animateProgress(this.opacityAnimationTick(0, 1), this.duration * 0.1);
        animateProgress(this.sizeAnimationTick(this.initialSize, this.finalSize), this.duration * 0.1);
      },
      () => animateProgress(this.positionYAnimationTick(this.initialPosition, this.finalPosition), this.duration),
      () => animateProgress(this.opacityAnimationTick(1, 0), this.duration * 0.1)
    ]);
  }
}
