import * as THREE from 'three';

import {getSvgObject} from '../../svg-loader';
import {setMeshParams,  getMaterial, reflectivitySettings, colors} from '../../common';
import {secondStoryConfig} from '../config';
import {loadModel} from '../../load-object-model';

import Pyramid from '../../objects/pyramid';
import Lantern from '../../objects/lantern';
import Wall from '../../objects/wall';

class SecondStory extends THREE.Group {
  constructor() {
    super();

    this.models = secondStoryConfig.models;

    this.constructChildren = this.constructChildren.bind(this);
    this.constructChildren();
  }

  constructChildren() {
    this.addWall();
    this.loadModels();
    this.addLantern();
    this.addLeaf();
    this.addPyramid();
  }

  addWall() {
    const wall = new Wall({
      wallMaterialReflectivity: reflectivitySettings.basic,
      wallColor: colors.Blue,
      floorColor: colors.BrightBlue,
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

  async addLeaf() {
    const svgObject = await getSvgObject();
    const leaf1 = svgObject.getObject(`leaf-1`);
    setMeshParams(leaf1, secondStoryConfig.leaf1);

    this.add(leaf1);
  }

  addPyramid() {
    const pyramid = new Pyramid();
    setMeshParams(pyramid, secondStoryConfig.pyramid);

    this.add(pyramid);
  }

  addLantern() {
    const lantern = new Lantern();
    setMeshParams(lantern, secondStoryConfig.lantern);

    this.add(lantern);
  }
}

export default SecondStory;
