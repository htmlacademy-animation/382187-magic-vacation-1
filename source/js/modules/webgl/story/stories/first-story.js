import * as THREE from 'three';

import {getSvgObject} from '../../svg-loader';
import {setMeshParams} from '../../common';
import {firstStoryConfig} from '../config';

import Carpet from '../objects/carpet';
import Saturn from '../objects/saturn';

class FirstStory extends THREE.Group {
  constructor() {
    super();

    this.constructChildren = this.constructChildren.bind(this);

    this.constructChildren();
  }

  constructChildren() {
    this.addFlower();
    this.addCarpet();
    this.addSaturn();
  }

  async addFlower() {
    const svgObject = await getSvgObject();
    const flower = svgObject.getObject(`flower`);
    setMeshParams(flower, firstStoryConfig.flower);
    this.add(flower);
  }

  addCarpet() {
    const carpet = new Carpet();
    setMeshParams(carpet, firstStoryConfig.carpet);
    this.add(carpet);
  }

  addSaturn() {
    const saturn = new Saturn();
    setMeshParams(saturn, firstStoryConfig.saturn);
    this.add(saturn);
  }
}

export default FirstStory;
