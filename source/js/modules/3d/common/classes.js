const baseClass = `background`;
const elementsClassnames = [
  `page-header`,
  `social-block`,
];

function setBEMModificators(mod, value, elementClassnames) {
  elementClassnames.forEach((elementClassName) => {
    const element = document.querySelector(`.${elementClassName}`);
    if (!element) {
      return;
    }

    const startsWith = `${elementClassName}--${mod}`;

    const prevBackgroundClass = [...element.classList].find((localClassName) => localClassName.startsWith(startsWith));
    element.classList.remove(prevBackgroundClass);
    if (value) {
      element.classList.add(`${startsWith}-${value}`);
    }
  });
}

export default (value) => {
  setBEMModificators(baseClass, value, elementsClassnames);
};
