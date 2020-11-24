import animateCrocodileScene from "./crocodile-scene";

export default () => {
  const gameBtns = document.querySelectorAll(`.game__button`);
  const loseResultTitle = document.querySelector(`#result3 .result__title`);
  // TODO. Set correct timing. Now 2 second just to show seacalf scene animation
  const COUNTDOWN_TIME = 1 * 2 * 1000;
  const endTime = new Date().getTime() + COUNTDOWN_TIME;
  const minutesElement = document.querySelector(`.game__counter span:first-child`);
  const secondsElement = document.querySelector(`.game__counter span:last-child`);

  function getRemainingTime(deadline) {
    const currentTime = new Date().getTime();
    return deadline - currentTime;
  }

  function pad(value) {
    return (`0` + Math.floor(value)).slice(-2);
  }

  function showTime() {
    const remainingTime = getRemainingTime(endTime);
    const seconds = pad((remainingTime / 1000) % 60);
    const minutes = pad((remainingTime / (60 * 1000)) % 60);

    minutesElement.textContent = minutes;
    secondsElement.textContent = seconds;

    if (remainingTime >= 1000) {
      requestAnimationFrame(showTime);
    } else {
      gameBtns[2].click();
      const img = document.createElement(`img`);
      img.src = `./img/lose-result.svg`;
      loseResultTitle.append(img);
      animateCrocodileScene();
    }
  }

  requestAnimationFrame(showTime);
};
