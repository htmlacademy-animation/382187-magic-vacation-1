import * as THREE from 'three';

import {getSvgObject} from '../../svg-loader';
import {fourthStoryConfig, objectsToAdd} from '../config';
import {setMeshParams, getMaterial, reflectivitySettings, colors} from '../../common';
import {loadModel} from '../../load-object-model';

import Carpet from '../../objects/carpet';
import Saturn from '../../objects/saturn';
import Wall from '../../objects/wall';

class FourthStory extends THREE.Group {
  constructor() {
    super();

    this.models = fourthStoryConfig.models;
    this.sonya = null;

    this.startTime = -1;

    this.constructChildren = this.constructChildren.bind(this);
    this.constructChildren();
  }

  constructChildren() {
    this.addWall();
    this.loadModels();
    this.addFlower();
    this.addCarpet();
    this.addSaturn();
    this.addSonya();
  }

  update() {
    if (this.startTime < 0) {
      this.startTime = new THREE.Clock();
      return;
    }

    const t = this.startTime.getElapsedTime();

    this.animateSonya(t);
  }

  addWall() {
    const wall = new Wall({
      wallMaterialReflectivity: reflectivitySettings.basic,
      wallColor: colors.ShadowedPurple,
      floorColor: colors.ShadowedDarkPurple,
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
    const saturn = new Saturn({isDarkTheme: true, basic: false});
    setMeshParams(saturn, fourthStoryConfig.saturn);
    this.add(saturn);
  }

  addSonya() {
    const params = objectsToAdd.sonya;
    const material = params.color && getMaterial({color: params.color, ...params.materialReflectivity});

    loadModel(params, material, (mesh) => {
      const outerGroup = new THREE.Group();
      outerGroup.castShadow = true;
      outerGroup.receiveShadow = true;
      const fluctuationGroup = new THREE.Group();

      setMeshParams(fluctuationGroup, {scale: params.scale});
      setMeshParams(fluctuationGroup, {rotate: params.rotate});
      setMeshParams(outerGroup, {position: params.position});

      this.sonya = {
        body: {root: outerGroup, fluctuation: fluctuationGroup, mesh, params},
        hands: {
          right: mesh.children[0].children[0].children[1],
          left: mesh.children[0].children[0].children[2],
        }
      };

      fluctuationGroup.add(mesh);
      outerGroup.add(fluctuationGroup);
      this.add(outerGroup);
    });
  }

  animateSonya(t) {
    if (!this.sonya) {
      return;
    }

    const meshAmp = 7;
    const meshPeriod = 2;

    const handsAmp = 0.2;
    const handsPeriod = 4;

    this.sonya.body.fluctuation.position.y = meshAmp * Math.sin((Math.PI * t) / meshPeriod);
    this.sonya.hands.left.rotation.y = handsAmp * Math.sin((Math.PI * t) / -handsPeriod) + 0.9;
    this.sonya.hands.right.rotation.y = handsAmp * Math.sin((Math.PI * t) / handsPeriod) - 0.9;
  }
}

export default FourthStory;
