import * as THREE from 'three';

import {getMaterial} from '../common';
import {pyramidConfig} from './config';

class Pyramid extends THREE.Group {
  constructor() {
    super();

    this.config = pyramidConfig;
    this.addPyramid = this.addPyramid.bind(this);

    this.addPyramid();
  }

  addPyramid() {
    const cone = new THREE.ConeBufferGeometry(
        this.config.radius,
        this.config.height,
        this.config.radialSegments
    );
    const mesh = new THREE.Mesh(cone, getMaterial({
      color: this.config.color,
      ...this.config.reflectivitySettings
    }));
    this.add(mesh);
  }
}

export default Pyramid;
