import * as THREE from 'three';

import {getSvgObject} from '../../svg-loader';
import {loadModel} from '../../load-object-model';
import {setMeshParams, getMaterial, reflectivitySettings, colors} from '../../common';
import {firstStoryConfig} from '../config';

import Carpet from '../../objects/carpet';
import Saturn from '../../objects/saturn';
import Wall from '../../objects/wall';

class FirstStory extends THREE.Group {
  constructor() {
    super();

    this.models = firstStoryConfig.models;

    this.constructChildren = this.constructChildren.bind(this);
    this.constructChildren();
  }

  constructChildren() {
    this.addWall();
    this.loadModels();
    this.addFlower();
    this.addCarpet();
    this.addSaturn();
  }

  addWall() {
    const wall = new Wall({
      wallMaterialReflectivity: reflectivitySettings.soft,
      wallColor: colors.Purple,
      floorColor: colors.DarkPurple,
    });
    this.add(wall);
  }

  addObject(params) {
    const material = params.color && getMaterial({color: params.color, ...params.materialReflectivity});

    loadModel(params, material, (mesh) => {
      mesh.name = params.name;
      setMeshParams(mesh, params);
      this.add(mesh);
    });
  }

  loadModels() {
    this.models.forEach((params) => {
      this.addObject(params);
    });
  }

  async addFlower() {
    const svgObject = await getSvgObject();
    const flower = svgObject.getObject(`flower`);
    setMeshParams(flower, firstStoryConfig.flower);
    this.add(flower);
  }

  addCarpet() {
    const carpet = new Carpet({isDark: false});
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
