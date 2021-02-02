import * as THREE from 'three';

import {getLathePointsForCircle, getLatheDegrees, colors} from '../../common';
import {roadConfig} from './config';
import RoadMaterial from '../materials/road';

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

    const material = new RoadMaterial({
      mainColor: colors.Grey,
      stripeColor: colors.White
    });

    const road = new THREE.LatheBufferGeometry(points, this.road.segments, start, length);
    const mesh = new THREE.Mesh(road, material);

    this.add(mesh);
  }
}

export default Road;
