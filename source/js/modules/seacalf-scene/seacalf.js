import {
  animateEasing,
  animateProgress,
  rotateCtx,
  tick,
  bounce, makeEaseOut, runSerial
} from '../helpers';

export default class Seacalf {
  constructor({duration, ctx}) {
    this.duration = duration;
    this.ctx = ctx;

    this.seacalf = {
      src: `./img/sea-calf-2.png`,
      width: 400,
      height: 400,
    };

    this.ice = {
      src: `./img/ice.png`,
      width: 408,
      height: 167,
    };

    this.initialPosition = {
      top: window.innerHeight,
      left: window.innerWidth / 2 - this.seacalf.width / 2,
    };
    this.finalPosition = {
      top: window.innerHeight / 2 - this.seacalf.height / 2 + 100,
      left: window.innerWidth / 2 - this.seacalf.width / 2,
    };

    this.translateY = 0;
    this.angle = 30;
  }

  getCenter() {
    return {x: this.finalPosition.left + (this.seacalf.width / 2), y: this.translateY + (this.seacalf.height / 2)};
  }

  translateYAnimationTick(from, to) {
    return (progress) => {
      this.translateY = tick(from, to, progress);
    };
  }

  rotateAnimationTick(from, to) {
    return (progress) => {
      this.angle = tick(from, to, progress);
    };
  }

  animate() {
    runSerial([
      () => animateProgress(this.translateYAnimationTick(this.initialPosition.top, this.finalPosition.top), this.duration * 0.6),
      () => animateEasing(this.rotateAnimationTick(30, 0), this.duration * 0.5, makeEaseOut(bounce))
    ]);
  }

  draw() {
    this.ctx.save();
    const {x, y} = this.getCenter();
    rotateCtx(this.ctx, this.angle, x, y);
    this.ctx.translate(this.finalPosition.left, this.translateY);
    this.ctx.drawImage(this.ice.img, 0, 180, this.ice.width, this.ice.height);
    this.ctx.drawImage(this.seacalf.img, 0, 0, this.seacalf.width, this.seacalf.height);
    this.ctx.restore();
  }

  initImages() {
    this.seacalf.img = new Image();
    this.seacalf.img.src = this.seacalf.src;

    this.ice.img = new Image();
    this.ice.img.src = this.ice.src;
  }
}
