import * as THREE from 'three';

import {getLathePointsForCircle, getLatheDegrees, getMaterial} from '../../common';
import {roadConfig} from './config';

class Road extends THREE.Group {
  constructor() {
    super();

    this.road = roadConfig;

    this.addRoad = this.addRoad.bind(this);

    this.addRoad();
  }

  addRoad() {
    const points = getLathePointsForCircle(this.road.width, this.road.depth, this.road.radius);
    const {start, length} = getLatheDegrees(this.road.degStart, this.road.degEnd);

    const road = new THREE.LatheBufferGeometry(points, this.road.segments, start, length);
    const mesh = new THREE.Mesh(road, getMaterial({
      color: this.road.color,
      side: THREE.DoubleSide,
      flatShading: true,
    }));

    this.add(mesh);
  }
}

export default Road;
