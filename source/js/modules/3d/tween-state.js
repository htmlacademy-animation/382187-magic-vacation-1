class TweenState {
  constructor(object, newPosition, duration, onComplete) {
    this.object = object;
    this.duration = duration;
    this.startTime = -1;
    this.progress = 0;
    this.isComplete = false;
    this.onComplete = onComplete;

    const params = Object.keys(newPosition).filter((param) => object[param] !== newPosition[param]);

    this.params = params.map((paramName) => ({
      paramName,
      from: object[paramName],
      to: newPosition[paramName]
    }));
  }

  update(dt, t) {
    if (this.isComplete) {
      return;
    }

    if (this.progress >= 1) {
      if (!this.isComplete) {
        if (typeof this.onComplete === `function`) {
          this.onComplete.call(null);
        }
        this.isComplete = true;
      }

      return;
    }

    if (this.startTime < 0) {
      if (t) {
        this.startTime = t;
      }

      return;
    }

    let progress = (t - this.startTime) / this.duration;
    let easeProgress = progress;

    if (progress > 1) {
      progress = 1;
    }

    this.progress = progress;

    if (this.params.length < 1) {
      return;
    }

    //  Smoother end:
    const pseudoHalf1 = 1 / 5;
    const pseudoHalf2 = 4 / 5;

    if (easeProgress < pseudoHalf1) {
      easeProgress = pseudoHalf1 * (1 - Math.cos((progress * Math.PI) / (2 * pseudoHalf1)));
    } else {
      easeProgress = pseudoHalf1 + pseudoHalf2 * Math.sin(((progress - pseudoHalf1) * Math.PI) / (2 * pseudoHalf2));
    }

    this.params.forEach(({paramName, from, to}) => {
      this.object[paramName] = from + (to - from) * easeProgress;
    });
  }

  stop() {
    if (typeof this.onComplete === `function`) {
      this.onComplete.call(null);
    }
    this.isComplete = true;
  }
}

export default TweenState;
