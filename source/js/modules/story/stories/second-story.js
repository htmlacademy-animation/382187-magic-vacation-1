import * as THREE from 'three';

import Pyramid from '../objects/pyramid';
import Lantern from '../objects/lantern';

class SecondStory extends THREE.Group {
  constructor() {
    super();

    this.constructChildren = this.constructChildren.bind(this);

    this.constructChildren();
  }

  constructChildren() {
    this.addPyramid();
    this.addLantern();
  }

  getMaterial(options = {}) {
    const {color, ...other} = options;

    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      ...other,
    });
  }

  addPyramid() {
    const pyramid = new Pyramid();
    pyramid.scale.set(1.2, 1, 1.2);

    pyramid.rotation.copy(new THREE.Euler(10 * THREE.Math.DEG2RAD, 3 * THREE.Math.DEG2RAD, 0), `XYZ`);
    pyramid.position.set(-20, 70, -110);


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
