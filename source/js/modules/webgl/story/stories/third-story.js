import * as THREE from 'three';
import {setMeshParams} from '../../common';
import {thirdStoryConfig} from '../config';

import Snowman from '../objects/snowman';
import Road from '../objects/road';

class ThirdStory extends THREE.Group {
  constructor() {
    super();

    this.constructChildren = this.constructChildren.bind(this);

    this.constructChildren();
  }

  constructChildren() {
    this.addSnowman();
    this.addRoad();
  }

  addSnowman() {
    const snowman = new Snowman();
    setMeshParams(snowman, thirdStoryConfig.snowman);

    this.add(snowman);
  }

  addRoad() {
    const road = new Road();
    setMeshParams(road, thirdStoryConfig.road);

    this.add(road);
  }
}

export default ThirdStory;
