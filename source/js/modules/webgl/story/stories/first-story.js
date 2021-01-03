import * as THREE from 'three';

import {getSvgObject} from '../../svg-loader';

class FirstStory extends THREE.Group {
  constructor() {
    super();

    this.addFlower();
  }

  async addFlower() {
    const svgObject = await getSvgObject();
    const flower = svgObject.getObject(`flower`);
    flower.position.set(-200, 110, 100);
    flower.rotation.copy(new THREE.Euler(180 * THREE.Math.DEG2RAD, -35 * THREE.Math.DEG2RAD, -8 * THREE.Math.DEG2RAD), `XYZ`);
    flower.scale.set(0.55, 0.55, 0.55);
    this.add(flower);
  }
}

export default FirstStory;
