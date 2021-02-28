import * as THREE from 'three';

import {getSvgObject} from '../../svg-loader';
import {fourthStoryConfig} from '../config';
import {setMeshParams, getMaterial, reflectivitySettings, colors} from '../../common';
import {loadModel} from '../../load-object-model';

import Carpet from '../../objects/carpet';
import Saturn from '../../objects/saturn';
import Wall from '../../objects/wall';

class FourthStory extends THREE.Group {
  constructor() {
    super();

    this.models = fourthStoryConfig.models;

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
      wallMaterialReflectivity: reflectivitySettings.basic,
      wallColor: colors.ShadowedPurple,
      floorColor: colors.ShadowedDarkPurple,
    });
    this.add(wall);
  }

  addObject(params) {
    const material = params.color && getMaterial({color: params.color, ...params.materialReflectivity});

    loadModel(params, material, (mesh) => {
      mesh.name = params.name;
      mesh.castShadow = params.castShadow;
      mesh.receiveShadow = params.castShadow;
      setMeshParams(mesh, params);
      this.add(mesh);
    });
  }

  loadModels() {
    this.models.forEach((params) => {
      const material = params.color && getMaterial({color: params.color, ...params.materialReflectivity});

      loadModel(params, material, (mesh) => {
        mesh.name = params.name;
        setMeshParams(mesh, params);
        this.add(mesh);
      });
    });
  }

  async addFlower() {
    const svgObject = await getSvgObject();
    const flower = svgObject.getObject(`flower`);

    if (flower) {
      setMeshParams(flower, fourthStoryConfig.flower);
      this.add(flower);
    }
  }

  addCarpet() {
    const carpet = new Carpet({isDark: true});
    setMeshParams(carpet, fourthStoryConfig.carpet);
    this.add(carpet);
  }

  addSaturn() {
    const saturn = new Saturn({isDarkTheme: true, basic: false});
    setMeshParams(saturn, fourthStoryConfig.saturn);
    this.add(saturn);
  }
}

export default FourthStory;
