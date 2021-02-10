import * as THREE from 'three';

import {getLathePointsForCircle, getLatheDegrees, colors} from '../common';
import {carpetConfig} from './config';

import CarpetMaterial from '../materials/carpet';

class Carpet extends THREE.Group {
  constructor({isDark} = {}) {
    super();

    this.isDark = isDark;
    this.carpet = carpetConfig;
    this.addCarpet = this.addCarpet.bind(this);

    this.addCarpet();
  }

  addCarpet() {
    const points = getLathePointsForCircle(this.carpet.width, this.carpet.depth, this.carpet.radius);
    const {start, length} = getLatheDegrees(this.carpet.degStart, this.carpet.degEnd);

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
