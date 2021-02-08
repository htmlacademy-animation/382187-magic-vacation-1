import * as THREE from 'three';

import {getSvgObject} from '../../svg-loader';
import {setMeshParams} from '../../common';
import {fourthStoryConfig} from '../config';

import Carpet from '../objects/carpet';
import Saturn from '../objects/saturn';

class FourthStory extends THREE.Group {
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
    setMeshParams(flower, fourthStoryConfig.flower);
    this.add(flower);
  }

  addCarpet() {
    const carpet = new Carpet({isDark: true});
    setMeshParams(carpet, fourthStoryConfig.carpet);
    this.add(carpet);
  }

  addSaturn() {
    const saturn = new Saturn({isDarkTheme: true});
    setMeshParams(saturn, fourthStoryConfig.saturn);
    this.add(saturn);
  }
}

export default FourthStory;
