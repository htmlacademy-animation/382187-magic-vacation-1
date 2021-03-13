import * as THREE from 'three';

import {getAngleCoords, getMaterial, reflectivitySettings} from '../common';
import {fencingConfig} from './config';

function generatePositions(settings) {
  const degreeStep = (settings.degEnd - settings.degStart) / settings.count;

  return [...Array(settings.count)].map((_, index) => {
    return getAngleCoords(0, 0, settings.radius, (degreeStep * index + settings.offset) * THREE.Math.DEG2RAD);
  });
}

class Fencing extends THREE.Group {
  constructor() {
    super();

    this.positions = generatePositions(fencingConfig.settings);

    this.getCylinder = this.getCylinder.bind(this);
    this.constructChildren = this.constructChildren.bind(this);

    this.constructChildren();
  }

  constructChildren() {
    const {height} = fencingConfig.cylinder;
    this.positions.map(({x, y}) => {
      const cylinder = this.getCylinder();
      cylinder.position.set(x, -height / 2, y);
      this.add(cylinder);
    });
  }

  getCylinder() {
    const {radius, color, height, radialSegments} = fencingConfig.cylinder;
    const cylinder = new THREE.CylinderBufferGeometry(radius, radius, height, radialSegments);
    const mesh = new THREE.Mesh(cylinder, getMaterial({
      color,
      ...reflectivitySettings.soft,
    }));
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }
}

export default Fencing;
