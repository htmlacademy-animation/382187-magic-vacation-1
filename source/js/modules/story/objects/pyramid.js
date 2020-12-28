import * as THREE from 'three';
import {pyramidConfig, getMaterial} from '../common';

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
    const mesh = new THREE.Mesh(cone, getMaterial({color: this.config.color, flatShading: true}));
    this.add(mesh);
  }
}

export default Pyramid;
