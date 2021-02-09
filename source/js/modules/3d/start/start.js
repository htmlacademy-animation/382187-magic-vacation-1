import * as THREE from 'three';

import {svgsConfig, modelsConfig} from './config';
import {loadModel} from '../load-object-model';
import {getMaterial, setMeshParams} from '../common';
import {getSvgObject} from '../svg-loader';

import Saturn from '../objects/saturn';

class StartStory extends THREE.Group {
  constructor() {
    super();

    this.svgs = svgsConfig;
    this.models = modelsConfig;

    this.constructChildren = this.constructChildren.bind(this);
    this.constructChildren();
  }

  constructChildren() {
    this.loadSvgs();
    this.loadModels();
    this.addSaturn();
  }

  async loadSvgs() {
    const svgObject = await getSvgObject();
    this.svgs.forEach((params) => {
      const mesh = svgObject.getObject(params.name);
      setMeshParams(mesh, params);
      this.add(mesh);
    });
  }

  addSaturn() {
    const saturn = new Saturn({isDarkTheme: false, basic: true});
    const options = {
      scale: 0.35,
      position: {x: 300, y: -50, z: 100}
    };
    setMeshParams(saturn, options);
    this.add(saturn);
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
}

export default StartStory;
