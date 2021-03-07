import * as THREE from 'three';

import {getSvgObject} from '../../svg-loader';
import {loadModel} from '../../load-object-model';
import {setMeshParams, getMaterial, reflectivitySettings, colors} from '../../common';
import {firstStoryConfig, objectsToAdd} from '../config';

import Carpet from '../../objects/carpet';
import Saturn from '../../objects/saturn';
import Wall from '../../objects/wall';

const DOG_TAIL_ANIMATION_TIME_SEC = 3;
const SATURN_ANIMATION_TIME_SEC = 5;

class FirstStory extends THREE.Group {
  constructor() {
    super();

    this.models = firstStoryConfig.models;
    this.startTime = -1;

    this.dogTail = null;
    this.saturn = null;

    this.constructChildren = this.constructChildren.bind(this);
    this.constructChildren();
  }

  constructChildren() {
    this.addWall();
    this.loadModels();
    this.addFlower();
    this.addCarpet();
    this.addSaturn();
    this.addDog();
  }

  update() {
    if (this.startTime < 0) {
      this.startTime = new THREE.Clock();
      return;
    }

    const t = this.startTime.getElapsedTime();

    if (t < DOG_TAIL_ANIMATION_TIME_SEC) {
      this.animateDogTail(t);
    }

    if (t < SATURN_ANIMATION_TIME_SEC) {
      this.animateSaturn(t);
    }
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
    setMeshParams(flower, firstStoryConfig.flower);
    this.add(flower);
  }

  addCarpet() {
    const carpet = new Carpet({isDark: false});
    setMeshParams(carpet, firstStoryConfig.carpet);
    this.add(carpet);
  }

  addSaturn() {
    const mesh = new Saturn();
    const params = firstStoryConfig.saturn;

    const outerGroup = new THREE.Group();
    const fluctuationGroup = new THREE.Group();

    setMeshParams(fluctuationGroup, {scale: params.scale});
    setMeshParams(fluctuationGroup, {rotate: params.rotate});
    setMeshParams(outerGroup, {position: params.position});

    this.saturn = {root: outerGroup, fluctuation: fluctuationGroup, mesh, params};

    fluctuationGroup.add(mesh);
    outerGroup.add(fluctuationGroup);
    this.add(outerGroup);
  }

  addDog() {
    const params = objectsToAdd.dog;
    const material = params.color && getMaterial({color: params.color, ...params.materialReflectivity});

    loadModel(params, material, (mesh) => {
      mesh.name = params.name;
      this.dogTail = mesh.children[0].children[0];
      setMeshParams(mesh, params);
      this.add(mesh);
    });
  }

  animateDogTail(t) {
    if (!this.dogTail) {
      return;
    }

    const progress = Math.floor(t / DOG_TAIL_ANIMATION_TIME_SEC * 100);

    const amp = progress > 30 && progress < 50 ? 0.6 : 0.8;
    const period = progress > 40 && progress < 90 ? 2 : 3;

    this.dogTail.rotation.x = amp * Math.sin((10 * Math.PI * t) / period);
  }

  animateSaturn(t) {
    if (!this.saturn) {
      return;
    }

    const positionAmp = 35;
    const positionPeriod = 3;

    const rotateAmp = 1.2;
    const rotatePeriod = 8;

    this.saturn.root.position.x = positionAmp * Math.sin((Math.PI * t) / positionPeriod);
    this.saturn.fluctuation.rotation.y = rotateAmp * Math.sin((Math.PI * t) / rotatePeriod);
  }
}

export default FirstStory;
