import * as THREE from 'three';

import {suitcaseConfig} from './config';
import {getMaterial, setMeshParams} from '../common';
import {loadModel} from '../load-object-model';
import {tick, easeInOutQuad} from '../../helpers';

const SUITCASE_SQUASH_ANIMATION_TIME_SEC = 2.0;
const SUITCASE_POSITION_ANIMATION_TIME_SEC = 1.4;

class Suitcase extends THREE.Group {
  constructor(rig) {
    super();
    this.rig = rig;
    this.config = suitcaseConfig;
    this.startTime = -1;
    this.construct = this.construct.bind(this);

    this.construct();
  }

  construct() {
    const params = this.config;
    const material = params.color && getMaterial({color: params.color, ...params.materialReflectivity});

    loadModel(params, material, (mesh) => {
      const outerGroup = new THREE.Group();
      outerGroup.castShadow = params.castShadow;
      outerGroup.receiveShadow = params.receiveShadow;
      const fluctuationGroup = new THREE.Group();

      setMeshParams(fluctuationGroup, {rotate: params.rotate});
      setMeshParams(outerGroup, {scale: params.scale});
      setMeshParams(outerGroup, {position: params.position});

      this.suitcase = {root: outerGroup, fluctation: fluctuationGroup, mesh, params: this.config};

      fluctuationGroup.add(mesh);
      outerGroup.add(fluctuationGroup);
      this.rig.addSuitcase(outerGroup);
    });
  }

  animateAppearance() {
    if (this.suitcase) {
      if (this.startTime < 0) {
        this.startTime = new THREE.Clock();
        return;
      }

      const t = this.startTime.getElapsedTime();
      const params = this.suitcase.params;

      // Анимируем падение
      if (t < SUITCASE_POSITION_ANIMATION_TIME_SEC) {
        const positionY = tick(params.position.y, params.finalPosition.y, 1);
        const position = [params.finalPosition.x, positionY, params.finalPosition.z];

        this.suitcase.root.position.set(...position);
      // Анимируем сжатие / растяжение
      } else if (t > SUITCASE_POSITION_ANIMATION_TIME_SEC && t < SUITCASE_SQUASH_ANIMATION_TIME_SEC) {
        let scaleX;
        let scaleY;
        let scaleZ;

        scaleY = tick(params.scale.y, params.finalScale.y, easeInOutQuad(t));
        scaleX = scaleZ = 1 / (Math.sqrt(scaleY)) + 0.002;

        this.suitcase.root.scale.set(scaleX, scaleY, scaleZ);
      }
    }
  }
}

export default Suitcase;
