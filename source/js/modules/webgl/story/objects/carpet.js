import * as THREE from 'three';

import {getLathePointsForCircle, getLatheDegrees, getMaterial} from '../../common';
import {carpetConfig} from './config';

class Carpet extends THREE.Group {
  constructor() {
    super();

    this.carpet = carpetConfig;
    this.addRug = this.addRug.bind(this);

    this.addRug();
  }

  addRug() {
    const points = getLathePointsForCircle(this.carpet.width, this.carpet.depth, this.carpet.radius);
    const {start, length} = getLatheDegrees(this.carpet.degStart, this.carpet.degEnd);

    const carpet = new THREE.LatheBufferGeometry(points, this.carpet.segments, start, length);
    const mesh = new THREE.Mesh(carpet, getMaterial({
      color: new THREE.Color(this.carpet.color),
      side: THREE.DoubleSide,
      flatShading: true,
    }));

    this.add(mesh);
  }
}

export default Carpet;
