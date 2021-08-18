import isMobile from '../../../helpers/is-mobile';

const names = [`surf.obj`, `Skis`, `lantern`, `Table`, `Starfish`];

export const hideObjectsOnMobile = (parent) => {
  if (isMobile) {
    names.forEach((name) => {
      const object = parent.getObjectByName(name);
      if (object) {
        object.visible = false;
      }
    });
  }
};
