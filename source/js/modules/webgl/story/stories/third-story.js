import * as THREE from 'three';
import Snowman from '../objects/snowman';

class ThirdStory extends THREE.Group {
  constructor() {
    super();

    this.addSnowman();
  }

  addSnowman() {
    const snowman = new Snowman(this.getMaterial);

    snowman.scale.set(0.75, 0.75, 0.75);
    snowman.rotation.copy(new THREE.Euler(10 * THREE.Math.DEG2RAD, 40 * THREE.Math.DEG2RAD, 0), `XYZ`);
    snowman.position.set(-20, -110, 0);
    this.add(snowman);
  }
}

export default ThirdStory;
