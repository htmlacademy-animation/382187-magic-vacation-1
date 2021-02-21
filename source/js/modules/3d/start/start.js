import * as THREE from 'three';

import {svgsConfig, modelsConfig, keyholeConfig, saturnModelConfig} from './config';
import {loadModels} from '../load-object-model';
import {setMeshParams} from '../common';
import {tick, easeOutQuad} from '../../helpers';
import {getSvgObject} from '../svg-loader';

import Saturn from '../objects/saturn';

const INITIAL_ANIMATION_TIME_SEC = 2;

class StartStory extends THREE.Group {
  constructor() {
    super();

    this.svgs = svgsConfig;
    this.models = modelsConfig;

    this.animatedItems = {};

    this.startTime = -1;

    this.constructChildren = this.constructChildren.bind(this);
    this.constructChildren();
  }

  async constructChildren() {
    this.loadKeyhole();
    this.loadModels();
    this.loadSvgs();
    this.addSaturn();
  }

  addToAnimatedItems(key, value) {
    this.animatedItems[key] = value;
  }

  update() {
    if (this.startTime < 0) {
      this.startTime = new THREE.Clock();
      return;
    }

    const t = this.startTime.getElapsedTime();

    if (t > INITIAL_ANIMATION_TIME_SEC) {
      this.infiniteAnimation(t);
      return;
    }

    this.initialAnimation(t);
  }

  infiniteAnimation(t) {
    if (!Object.values(this.animatedItems).length) {
      return;
    }

    const amp = 4;
    const period = 6;

    Object.values(this.animatedItems).forEach((item, index) => {
      item.fluctuation.position.y = item.params.finalPosition.y + amp * Math.sin((2 * Math.PI * t + index) / period);
    });
  }

  initialAnimation(t) {
    if (!Object.values(this.animatedItems).length) {
      return;
    }

    Object.values(this.animatedItems).forEach((item) => {
      const finalScale = item.params.scale;

      const scaleX = tick(0, finalScale.x, easeOutQuad(t / 2));
      const scaleY = tick(0, finalScale.y, easeOutQuad(t / 2));
      const scaleZ = tick(0, finalScale.z, easeOutQuad(t / 2));

      const finalPosition = item.params.finalPosition;

      const positionX = tick(0, finalPosition.x, easeOutQuad(t / 2));
      const positionY = tick(0, finalPosition.y, easeOutQuad(t / 2));
      const positionZ = tick(0, finalPosition.z, easeOutQuad(t / 2));

      const position = [positionX, positionY, positionZ];

      item.fluctuation.position.set(...position);
      item.fluctuation.scale.set(scaleX, scaleY, scaleZ);
    });
  }

  async loadKeyhole() {
    const svgObject = await getSvgObject();
    const mesh = svgObject.getObject(`keyhole`);
    setMeshParams(mesh, keyholeConfig);
    this.add(mesh);
  }

  async loadSvgs() {
    const svgObject = await getSvgObject();

    Object.values(this.svgs).forEach((params) => {
      const mesh = svgObject.getObject(params.name);

      const outerGroup = new THREE.Group();
      const fluctuationGroup = new THREE.Group();

      setMeshParams(fluctuationGroup, {scale: {x: 0, y: 0, z: 0}});
      setMeshParams(fluctuationGroup, {rotate: params.rotate});
      setMeshParams(outerGroup, {position: params.position});

      this.addToAnimatedItems(params.name, {root: outerGroup, fluctuation: fluctuationGroup, mesh, params});

      fluctuationGroup.add(mesh);
      outerGroup.add(fluctuationGroup);
      this.add(outerGroup);
    });
  }

  addSaturn() {
    const mesh = new Saturn({isDarkTheme: false, basic: true});
    const outerGroup = new THREE.Group();
    const fluctuationGroup = new THREE.Group();

    setMeshParams(fluctuationGroup, {scale: {x: 0, y: 0, z: 0}});
    setMeshParams(fluctuationGroup, {rotate: saturnModelConfig.rotate});
    setMeshParams(outerGroup, {position: saturnModelConfig.position});

    fluctuationGroup.add(mesh);
    outerGroup.add(fluctuationGroup);

    this.addToAnimatedItems(`saturn`, {root: outerGroup, fluctuation: fluctuationGroup, mesh, params: saturnModelConfig});

    this.add(outerGroup);
  }

  async loadModels() {
    const meshes = await loadModels(Object.values(this.models));

    meshes.forEach((mesh) => {
      const outerGroup = new THREE.Group();
      const fluctuationGroup = new THREE.Group();

      setMeshParams(fluctuationGroup, {scale: {x: 0, y: 0, z: 0}});
      setMeshParams(fluctuationGroup, {rotate: this.models[mesh.name].rotate});
      setMeshParams(outerGroup, {position: this.models[mesh.name].position});

      this.addToAnimatedItems(mesh.name, {root: outerGroup, fluctuation: fluctuationGroup, mesh, params: this.models[mesh.name]});

      fluctuationGroup.add(mesh);
      outerGroup.add(fluctuationGroup);
      this.add(outerGroup);
    });
  }
}

export default StartStory;
