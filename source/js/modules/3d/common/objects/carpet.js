import * as THREE from 'three';

import {getLathePointsForCircle, getCircleDegrees} from '../helpers';
import colors from '../colors';

import CarpetMaterial from '../materials/carpet';

class Carpet extends THREE.Group {
  constructor({isDark} = {}) {
    super();

    this.isDark = !!isDark;
    this.carpet = {
      width: 180,
      depth: 3,
      radius: 763,
      degStart: 16,
      degEnd: 74,
      color: `#A481D1`,
      segments: 40,
      stripes: 7,
    };
    this.addCarpet = this.addCarpet.bind(this);

    this.addCarpet();
  }

  addCarpet() {
    const points = getLathePointsForCircle(this.carpet.width, this.carpet.depth, this.carpet.radius);
    const {start, length} = getCircleDegrees(this.carpet.degStart, this.carpet.degEnd);

    const material = new CarpetMaterial({
      mainColor: this.isDark ? colors.ShadowedLightPurple : colors.LightPurple,
      stripeColor: this.isDark ? colors.ShadowedAdditionalPurple : colors.AdditionalPurple,
    });

    const carpet = new THREE.LatheBufferGeometry(points, this.carpet.segments, start, length);
    const mesh = new THREE.Mesh(carpet, material);

    this.add(mesh);
  }
}

export default Carpet;
