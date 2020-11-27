import {animateProgress, tick} from '../helpers';

export default class Crocodile {
  constructor({duration, ctx, src}) {
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;
    this.duration = duration;
    this.ctx = ctx;

    this.size = {
      width: 535,
      height: 170
    };

    this.img = new Image();
    this.img.src = src;

    this.initialPosition = {
      top: this.wh / 2 - this.size.height / 2 + 140,
      left: this.ww / 2,
    };

    this.position = {
      top: this.wh / 2 - this.size.height / 2 + 140,
      left: this.ww / 2 + this.size.width,
    };

    this.finalPosition = {
      top: this.wh / 2 - this.size.height / 2 + 170,
      left: this.ww / 2 - this.size.width / 2 + 20,
    };

    this.opacity = 0;
  }

  positionAnimationTick(from, to) {
    return (progress) => {
      this.position.left = tick(from.left, to.left, progress);
      this.position.top = tick(from.top, to.top, progress);
    };
  }

  opacityAnimationTick(from, to) {
    return (progress) => {
      this.opacity = tick(from, to, progress);
    };
  }

  drawMask(x, y, width, height) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x, y + height);
    this.ctx.lineTo(x + width * 0.79, y + height);
    this.ctx.lineTo(x + width * 0.665, y);
    this.ctx.closePath();

    this.ctx.clip();
  }

  draw() {
    this.ctx.save();

    this.drawMask(this.ww / 2 - this.size.width / 2 - 60, this.wh / 2, 550, 300);
    this.ctx.drawImage(this.img, this.position.left, this.position.top, this.size.width, this.size.height);
    this.ctx.restore();
  }

  animate() {
    animateProgress(this.positionAnimationTick(this.initialPosition, this.finalPosition), this.duration);
  }
}
