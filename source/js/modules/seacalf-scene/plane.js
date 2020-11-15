import {
  animateProgress,
  rotateCtx,
  rotateCoords,
  tick,
} from '../helpers';

export default class Plane {
  constructor({duration, ctx}) {
    this.duration = duration;
    this.ctx = ctx;

    this.plane = {
      src: `./img/airplane.png`,
      width: 130,
      height: 130,
    };

    this.initialPlanePosition = {
      top: window.innerHeight / 2 - this.plane.height / 2 - 50,
      left: window.innerWidth / 2 - this.plane.width / 2,
      angle: 80,
    };

    this.planePosition = {...this.initialPlanePosition};

    this.finalPlanePosition = {
      top: window.innerHeight / 2 - this.plane.height - 50,
      left: window.innerWidth / 2 + 300,
      angle: 0,
    };

    this.opacity = 0;

    this.planePositionAmplitude = this.initialPlanePosition.top - this.finalPlanePosition.top;

    this.previousPlanePositionDelta = this.planePosition.top - this.initialPlanePosition.top;

    this.initialBackground = {
      progress: 0,
      size: 0,
    };

    this.background = {
      ...this.initialBackground,
      color: `#ACC3FF`,
    };

    this.finalBackground = {
      progress: 1,
      size: 300,
    };

    this.arcAngles = {start: Math.PI / 2, end: Math.PI * 3 / 2};

    this.rightTree = {
      src: `./img/tree.png`,
      height: 101,
      width: 38,
      left: this.initialPlanePosition.left + 150,
      top: this.initialPlanePosition.top + 140
    };

    this.leftTree = {
      src: `./img/tree2.png`,
      height: 159,
      width: 50,
      left: this.rightTree.left - this.rightTree.width,
      top: this.initialPlanePosition.top + 80,
    };

    this.leftTreeInitialOffset = 200;
    this.leftTreeFinalOffset = 0;

    this.draw = this.draw.bind(this);
  }

  getPlaneCenter() {
    return {x: this.planePosition.left + (this.plane.width / 2), y: this.planePosition.top + (this.plane.height / 2)};
  }

  getPlaneTrace() {
    const center = this.getPlaneCenter();
    const zeroDegreeCoords = {x: this.planePosition.left + this.plane.width * 0.3, y: this.planePosition.top + this.plane.height * 0.7};

    return rotateCoords(center.x, center.y, zeroDegreeCoords.x, zeroDegreeCoords.y, this.planePosition.angle);
  }

  opacityAnimationTick(from, to) {
    return (progress) => {
      this.opacity = tick(from, to, progress);
    };
  }

  planePositionAnimationTick(from, to) {
    return (progress) => {
      this.planePosition.left = tick(from.left, to.left, progress);
      const offset = this.planePositionAmplitude * Math.sin(progress * Math.PI * 3 / 4);
      this.planePosition.top = offset + this.initialPlanePosition.top;
    };
  }

  planeRotateAnimationTick(from, to) {
    return (progress) => {
      this.planePosition.angle = tick(from, to, Math.pow(progress, 2.5));
    };
  }

  backgroundAnimationTick(from, to) {
    return (progress) => {
      this.background.progress = progress;
      this.background.size = tick(from, to, progress);
    };
  }

  leftTreePositionTick(from, to) {
    return (progress) => {
      this.leftTree.offset = tick(from, to, progress);
    };
  }

  animate() {
    animateProgress(this.opacityAnimationTick(0, 1), this.duration);
    animateProgress(this.planePositionAnimationTick(this.initialPlanePosition, this.finalPlanePosition), this.duration);
    animateProgress(this.planeRotateAnimationTick(this.initialPlanePosition.angle, this.finalPlanePosition.angle), this.duration);
    animateProgress(this.backgroundAnimationTick(this.initialBackground.size, this.finalBackground.size), this.duration);
    animateProgress(this.leftTreePositionTick(this.leftTreeInitialOffset, this.leftTreeFinalOffset), this.duration);
  }

  drawPlane() {
    this.ctx.save();
    const {x, y} = this.getPlaneCenter();
    rotateCtx(this.ctx, this.planePosition.angle, x, y);
    this.ctx.translate(this.planePosition.left, this.planePosition.top);
    this.ctx.drawImage(this.plane.img, 0, 0, this.plane.width, this.plane.height);
    this.ctx.restore();
  }

  drawTrace() {
    this.ctx.save();

    this.backgroundRadius = this.background.size / 2;
    const arcCenter = {x: this.initialPlanePosition.left, y: this.initialPlanePosition.top + this.backgroundRadius};
    const curvesEndPoint = this.getPlaneTrace();

    const planeProgress = (this.planePosition.left - this.initialPlanePosition.left) / (this.finalPlanePosition.left - this.initialPlanePosition.left);
    const inversePlaneProgress = 1 - planeProgress;

    const topCurveControlPoint1 = {
      x: this.initialPlanePosition.left + 100,
      y: this.initialPlanePosition.top - inversePlaneProgress * 2,
    };

    const topCurveControlPoint2 = {
      x: this.planePosition.left - Math.pow(planeProgress, 2) * 70,
      y: this.planePosition.top + Math.pow(planeProgress, 2) * 200,
    };

    const bottomCurveControlPoint1 = {
      x: this.initialPlanePosition.left + 100,
      y: this.initialPlanePosition.top + this.background.size - inversePlaneProgress * 2,
    };

    const bottomCurveControlPoint2 = {
      x: this.planePosition.left - Math.pow(planeProgress, 2) * 70,
      y: this.planePosition.top + this.background.size - Math.pow(planeProgress, 2) * 100,
    };

    this.ctx.beginPath();

    this.ctx.arc(arcCenter.x, arcCenter.y, this.backgroundRadius, this.arcAngles.start, this.arcAngles.end);

    this.ctx.bezierCurveTo(topCurveControlPoint1.x, topCurveControlPoint1.y, topCurveControlPoint2.x, topCurveControlPoint2.y, curvesEndPoint.x, curvesEndPoint.y);

    this.ctx.moveTo(this.initialPlanePosition.left, this.initialPlanePosition.top + this.background.size);
    this.ctx.bezierCurveTo(bottomCurveControlPoint1.x, bottomCurveControlPoint1.y, bottomCurveControlPoint2.x, bottomCurveControlPoint2.y, curvesEndPoint.x, curvesEndPoint.y);

    this.ctx.fillStyle = this.background.color;
    this.ctx.clip(`evenodd`);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawRightTree() {
    this.ctx.save();
    this.ctx.drawImage(this.rightTree.img, this.rightTree.left, this.rightTree.top, this.rightTree.width, this.rightTree.height);
    this.ctx.restore();
  }

  drawLeftTree() {
    this.ctx.save();
    const offsetTop = this.leftTree.offset + this.leftTree.top;
    this.ctx.globalAlpha = Math.pow(this.opacity, 3);
    this.ctx.drawImage(this.leftTree.img, this.leftTree.left, offsetTop, this.leftTree.width, this.leftTree.height);
    this.ctx.restore();
  }

  drawTrees() {
    this.drawRightTree();
    this.drawLeftTree();
  }

  draw() {
    this.ctx.save();
    this.ctx.globalAlpha = this.opacity;
    this.drawPlane();
    this.drawTrace();
    this.drawTrees();
    this.ctx.restore();
  }

  initImages() {
    this.plane.img = new Image();
    this.plane.img.src = this.plane.src;

    this.leftTree.img = new Image();
    this.leftTree.img.src = this.leftTree.src;

    this.rightTree.img = new Image();
    this.rightTree.img.src = this.rightTree.src;
  }
}
