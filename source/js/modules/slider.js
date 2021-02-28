import Swiper from "swiper";
import Start from "./3d/start";
import Story from './3d/story';

export default () => {
  let storySlider;
  const story = new Story();
  const start = new Start();

  const setSlider = function () {
    if (((window.innerWidth / window.innerHeight) < 1) || window.innerWidth < 769) {
      storySlider = new Swiper(`.js-slider`, {
        pagination: {
          el: `.swiper-pagination`,
          type: `bullets`
        },
        keyboard: {
          enabled: true
        },
        on: {
          slideChange: () => {
            if (storySlider.activeIndex === 0 || storySlider.activeIndex === 1) {
              story.changeStory(0);
            } else if (storySlider.activeIndex === 2 || storySlider.activeIndex === 3) {
              story.changeStory(1);
            } else if (storySlider.activeIndex === 4 || storySlider.activeIndex === 5) {
              story.changeStory(2);
            } else if (storySlider.activeIndex === 6 || storySlider.activeIndex === 7) {
              story.changeStory(3);
            }
          },
          resize: () => {
            storySlider.update();
          }
        },
        observer: true,
        observeParents: true
      });
    } else {
      storySlider = new Swiper(`.js-slider`, {
        slidesPerView: 2,
        slidesPerGroup: 2,
        pagination: {
          el: `.swiper-pagination`,
          type: `fraction`
        },
        navigation: {
          nextEl: `.js-control-next`,
          prevEl: `.js-control-prev`,
        },
        keyboard: {
          enabled: true
        },
        on: {
          slideChange: () => {
            if (storySlider.activeIndex === 0) {
              story.changeStory(0);
            } else if (storySlider.activeIndex === 2) {
              story.changeStory(1);
            } else if (storySlider.activeIndex === 4) {
              story.changeStory(2);
            } else if (storySlider.activeIndex === 6) {
              story.changeStory(3);
            }
          },
          resize: () => {
            storySlider.update();
          }
        },
        observer: true,
        observeParents: true
      });
    }
  };

  window.addEventListener(`resize`, function () {
    if (storySlider) {
      storySlider.destroy();
    }
    setSlider();
  });

  document.body.addEventListener(`screenChanged`, (event) => {
    const {detail: {screenName}} = event;

    if (screenName === `top`) {
      start.start();
    } else {
      start.endAnimation();
    }

    if (screenName === `story`) {
      story.start();
    } else {
      story.endAnimation();
    }
  });

  setSlider();
};
