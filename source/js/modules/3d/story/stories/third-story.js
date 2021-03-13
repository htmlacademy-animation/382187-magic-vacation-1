import * as THREE from 'three';
import {thirdStoryConfig, objectsToAdd} from '../config';
import {setMeshParams, getMaterial, reflectivitySettings, colors} from '../../common';
import {loadModel} from '../../load-object-model';

import Snowman from '../../objects/snowman';
import Fencing from '../../objects/fencing';
import Road from '../../objects/road';
import Wall from '../../objects/wall';

class ThirdStory extends THREE.Group {
  constructor() {
    super();

    this.models = thirdStoryConfig.models;
    this.compassArrow = null;

    this.startTime = -1;

    this.constructChildren = this.constructChildren.bind(this);
    this.constructChildren();
  }

  constructChildren() {
    this.addWall();
    this.loadModels();
    this.addSnowman();
    this.addFencing();
    this.addRoad();
    this.addCompass();
  }

  update() {
    if (this.startTime < 0) {
      this.startTime = new THREE.Clock();
      return;
    }

    const t = this.startTime.getElapsedTime();

    this.animateCompassArrow(t);
  }

  addWall() {
    const wall = new Wall({
      wallMaterialReflectivity: reflectivitySettings.soft,
      wallColor: colors.SkyLightBlue,
      floorColor: colors.MountainBlue,
    });
    this.add(wall);
  }

  loadModels() {
    this.models.forEach((params) => {
      const material = params.color && getMaterial({color: params.color, ...params.materialReflectivity});

      loadModel(params, material, (mesh) => {
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

  addFencing() {
    const fencing = new Fencing();
    setMeshParams(fencing, thirdStoryConfig.fencing);
    this.add(fencing);
  }

  addRoad() {
    const road = new Road();
    setMeshParams(road, thirdStoryConfig.road);
    this.add(road);
  }

  addCompass() {
    const params = objectsToAdd.compass;
    const material = params.color && getMaterial({color: params.color, ...params.materialReflectivity});

    loadModel(params, material, (mesh) => {
      this.compassArrow = mesh.children[0].children[0];
      setMeshParams(mesh, params);
      this.add(mesh);
    });
  }

  animateCompassArrow(t) {
    if (!this.compassArrow) {
      return;
    }

    const amp = 0.2;
    const period = 3;

    this.compassArrow.rotation.z = amp * Math.sin((Math.PI * t) / period);
  }
}

export default ThirdStory;
