import {
  animateProgress,
  tick,
  skewCtx,
} from '../helpers';

export default class Snowflake {
  constructor(props) {
    const {
      duration,
      ctx,
      position,
      skew,
      scale,
    } = props;

    this.duration = duration;
    this.ctx = ctx;

    this.snowflake = {
      src: `./img/snowflake.png`,
      width: 200,
      height: 200,
    };

    this.initialPosition = position;
    this.skew = skew;
    this.scale = scale;

    this.maxOffset = 50;
    this.currentOffset = 0;
    this.offsetProgress = 0;
  }

  opacityAnimationTick(from, to) {
    return (progress) => {
      this.opacity = tick(from, to, progress);
    };
  }

  translateYAnimationTick() {
    this.currentOffset = 10 * Math.sin(this.offsetProgress) + this.maxOffset / 2;
    this.offsetProgress += 12.5;
  }

  animate() {
    animateProgress(this.translateYAnimationTick.bind(this), this.duration);
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.initialPosition.left, this.initialPosition.top - this.currentOffset);
    skewCtx(this.ctx, ...this.skew);
    this.ctx.scale(...this.scale);
    this.ctx.drawImage(this.snowflake.img, 0, 0, this.snowflake.width, this.snowflake.height);
    this.ctx.restore();
  }

  initImage() {
    this.snowflake.img = new Image();
    this.snowflake.img.src = this.snowflake.src;
  }
}
