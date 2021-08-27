import {showFailureScreen} from "./chat";

const COUNTDOWN_TIME = 13 * 1000;

class Timer {
  constructor(onEnd) {
    this.minutesElement = document.querySelector(`.game__counter span:first-child`);
    this.secondsElement = document.querySelector(`.game__counter span:last-child`);

    this.animationRequest = null;
    this.onEnd = onEnd;

    this.start = this.start.bind(this);
    this.end = this.end.bind(this);
    this.getRemainingTime = this.getRemainingTime.bind(this);
    this.pad = this.pad.bind(this);
    this.showTime = this.showTime.bind(this);
  }

  getRemainingTime(deadline) {
    const currentTime = new Date().getTime();
    return deadline - currentTime;
  }

  pad(value) {
    return (`0` + Math.floor(value)).slice(-2);
  }

  showTime() {
    const remainingTime = this.getRemainingTime(this.endTime);
    const seconds = this.pad((remainingTime / 1000) % 60);
    const minutes = this.pad((remainingTime / (60 * 1000)) % 60);

    this.minutesElement.textContent = minutes;
    this.secondsElement.textContent = seconds;

    if (remainingTime >= 1000) {
      requestAnimationFrame(this.showTime);
    } else {
      this.onEnd();
    }
  }

  start() {
    this.endTime = new Date().getTime() + COUNTDOWN_TIME;
    this.animationRequest = requestAnimationFrame(this.showTime);
  }

  end() {
    if (this.animationRequest) {
      cancelAnimationFrame(this.animationRequest);
      this.animationRequest = null;
    }
  }
}

const timer = new Timer(showFailureScreen);

export default timer;
