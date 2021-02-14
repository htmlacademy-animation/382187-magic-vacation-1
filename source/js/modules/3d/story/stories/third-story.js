import * as THREE from 'three';
import {thirdStoryConfig} from '../config';
import {setMeshParams, getMaterial, reflectivitySettings, colors} from '../../common';
import {loadModel} from '../../load-object-model';

import Snowman from '../../objects/snowman';
import Road from '../../objects/road';
import Wall from '../../objects/wall';

class ThirdStory extends THREE.Group {
  constructor() {
    super();

    this.models = thirdStoryConfig.models;

    this.constructChildren = this.constructChildren.bind(this);
    this.constructChildren();
  }

  constructChildren() {
    this.addWall();
    this.loadModels();
    this.addSnowman();
    this.addRoad();
  }

  addWall() {
    const wall = new Wall({
      wallMaterialReflectivity: reflectivitySettings.soft,
      wallColor: colors.SkyLightBlue,
      floorColor: colors.MountainBlue,
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
