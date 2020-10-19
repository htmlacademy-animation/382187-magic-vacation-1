export default () => {
  const prizes = document.querySelectorAll(`.prizes__item`);
  const prizesImg = document.querySelectorAll(`.prizes__item picture`);
  const prizesNum = document.querySelectorAll(`.prizes__desc b`);
  const prizesOptions = {
    0: {src: `img/primary-award.svg`, timeout: 0, startValue: 3, endValue: 3},
    1: {src: `img/secondary-award.svg`, timeout: 3000, startValue: 1, endValue: 7},
    2: {src: `img/additional-award.svg`, timeout: 4500, startValue: 11, endValue: 900}
  };

  function createPrizeImg(container, src) {
    const img = document.createElement(`img`);
    img.src = src;
    container.append(img);
  }

  // функция отрисовки
  function draw(prizeNum, value) {
    prizeNum.textContent = value;
  }

  function tick(prizeNum, prizesOption, fpsInterval, now, then, value, elapsed) {
    // отправляем на отрисовку следующий кадр
    requestAnimationFrame(() => tick(prizeNum, prizesOption, fpsInterval, now, then, value, elapsed));
    // проверяем, сколько времени прошло с предыдущего запуска
    now = Date.now();
    elapsed = now - then;

    // проверяем, достаточно ли прошло времени с предыдущей отрисовки кадра
    if (elapsed > fpsInterval) {
      // сохранение времени текущей отрисовки кадра
      then = now - (elapsed % fpsInterval);
      value += Math.round((prizesOption.endValue - prizesOption.startValue) / 12);

      if (value <= prizesOption.endValue) {
        // запуск функции отрисовки
        draw(prizeNum, value);
      } else {
        value = prizesOption.endValue;
        draw(prizeNum, value);
      }
    }
  }

  for (let i = 0; i < prizesImg.length; i++) {
    // общие переменные для реализации точного fps
    let fpsInterval = 1000 / 12;
    let now = Date.now();
    let then = Date.now();
    let value = prizesOptions[i].startValue;
    let elapsed;
    setTimeout(() => {
      prizes[i].classList.add(`prizes__item--active`);
      createPrizeImg(prizesImg[i], prizesOptions[i].src);
      requestAnimationFrame(() => tick(prizesNum[i], prizesOptions[i], fpsInterval, now, then, value, elapsed));
    }, prizesOptions[i].timeout);
  }
};
