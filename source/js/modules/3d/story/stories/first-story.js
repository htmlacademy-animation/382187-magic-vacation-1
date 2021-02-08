import * as THREE from 'three';

import {getSvgObject} from '../../svg-loader';
import {loadModel} from '../../load-object-model';
import {setMeshParams, getMaterial} from '../../common';
import {firstStoryConfig} from '../config';

import Carpet from '../objects/carpet';
import Saturn from '../objects/saturn';

class FirstStory extends THREE.Group {
  constructor() {
    super();

    this.models = firstStoryConfig.models;

    this.constructChildren = this.constructChildren.bind(this);

    this.constructChildren();
  }

  constructChildren() {
    this.addFlower();
    this.addCarpet();
    this.addSaturn();
    this.loadModels();
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

  loadModels() {
    this.models.forEach((params) => {
      const material = params.color && getMaterial({color: params.color, ...params.materialReflectivity});

      loadModel(params, material, (mesh) => {
        mesh.name = params.name;
        mesh.scale.set(params.scale, params.scale, params.scale);
        mesh.position.set(...Object.values(params.position));
        mesh.rotation.copy(new THREE.Euler(params.rotate.x * THREE.Math.DEG2RAD, params.rotate.y * THREE.Math.DEG2RAD, params.rotate.z * THREE.Math.DEG2RAD, params.rotationOrder || `XYZ`));
        this.add(mesh);
      });
    });
  }
}

export default FirstStory;
