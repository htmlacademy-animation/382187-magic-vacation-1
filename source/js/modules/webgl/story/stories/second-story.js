import * as THREE from 'three';

import Pyramid from '../objects/pyramid';
import Lantern from '../objects/lantern';
import {getSvgObject} from '../../svg-loader';

class SecondStory extends THREE.Group {
  constructor() {
    super();

    this.constructChildren = this.constructChildren.bind(this);
    this.constructChildren();
  }

  constructChildren() {
    this.addLantern();
    this.addLeaf();
    this.addPyramid();
  }

  async addLeaf() {
    const svgObject = await getSvgObject();
    const leaf = svgObject.getObject(`leaf-2`);
    leaf.scale.set(0.85, 0.85, 0.85);
    leaf.position.set(-115, 40, 30);
    leaf.rotation.copy(new THREE.Euler(180 * THREE.Math.DEG2RAD, 3 * THREE.Math.DEG2RAD, 0), `XYZ`);

    this.add(leaf);
  }

  addPyramid() {
    const pyramid = new Pyramid();
    pyramid.scale.set(1.2, 1, 1.2);

    pyramid.rotation.copy(new THREE.Euler(10 * THREE.Math.DEG2RAD, 3 * THREE.Math.DEG2RAD, 0), `XYZ`);
    pyramid.position.set(-10, 70, -110);

    this.add(pyramid);
  }

  addLantern() {
    const lantern = new Lantern(this.getMaterial);

    lantern.scale.set(0.46, 0.46, 0.46);
    lantern.rotation.copy(new THREE.Euler(12 * THREE.Math.DEG2RAD, 60 * THREE.Math.DEG2RAD, 0), `XYZ`);
    lantern.position.set(178, -95, 10);
    this.add(lantern);
  }
}

export default SecondStory;
