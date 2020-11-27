import {animateProgress, tick} from '../helpers';

export default class Key {
  constructor({duration, ctx, src}) {
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;
    this.duration = duration;
    this.ctx = ctx;

    this.size = {
      width: 141,
      height: 262
    };

    this.img = new Image();
    this.img.src = src;

    this.finalSize = {
      width: 171,
      height: 292
    };

    this.opacity = 0;
  }

  opacityAnimationTick(from, to) {
    return (progress) => {
      this.opacity = tick(from, to, progress);
    };
  }

  sizeAnimationTick(from, to) {
    return (progress) => {
      this.size.width = tick(from.width, to.width, progress);
      this.size.height = tick(from.height, to.height, progress);
    };
  }

  draw() {
    this.ctx.save();
    this.ctx.globalAlpha = this.opacity;
    this.ctx.drawImage(this.img, this.ww / 2 - this.finalSize.width / 2, this.wh / 2 - this.finalSize.height / 2 + 70, this.size.width, this.size.height);
    this.ctx.restore();
  }

  animate() {
    animateProgress(this.opacityAnimationTick(0, 1), this.duration);
    animateProgress(this.sizeAnimationTick(this.size, this.finalSize), this.duration);
  }
}
