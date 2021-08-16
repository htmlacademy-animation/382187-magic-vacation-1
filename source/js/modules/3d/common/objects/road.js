import * as THREE from 'three';

import {getLathePointsForCircle, getCircleDegrees} from '../helpers';
import colors from '../colors';

import RoadMaterial from '../materials/road';

class Road extends THREE.Group {
  constructor() {
    super();

    this.road = {
      width: 160,
      depth: 3,
      radius: 732,
      degStart: 0,
      degEnd: 90,
      color: `#646B7C`,
      segments: 40,
    };

    this.addRoad = this.addRoad.bind(this);

    this.addRoad();
  }

  addRoad() {
    const points = getLathePointsForCircle(this.road.width, this.road.depth, this.road.radius);
    const {start, length} = getCircleDegrees(this.road.degStart, this.road.degEnd);

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
