import * as THREE from 'three';

import {getSvgObject} from '../../svg-loader';
import {setMeshParams, getMaterial, reflectivitySettings, colors, rotateAboutPoint} from '../../common';
import {secondStoryConfig} from '../config';
import {loadModel} from '../../load-object-model';
import {easeOutQuad} from '../../../helpers';

import Pyramid from '../../objects/pyramid';
import Lantern from '../../objects/lantern';
import Wall from '../../objects/wall';

const LEAVES_ANIMATION_CYCLE_SEC = 8;

class SecondStory extends THREE.Group {
  constructor() {
    super();

    this.models = secondStoryConfig.models;

    this.leaves = null;

    this.startTime = -1;

    this.constructChildren = this.constructChildren.bind(this);
    this.constructChildren();
  }

  constructChildren() {
    this.addWall();
    this.loadModels();
    this.addLantern();
    this.addPyramid();
    this.addLeaves();
  }

  update() {
    if (this.startTime < 0) {
      this.startTime = new THREE.Clock();
      return;
    }

    const t = this.startTime.getElapsedTime();

    this.animateLeaves(t);
  }

  addWall() {
    const wall = new Wall({
      wallMaterialReflectivity: reflectivitySettings.basic,
      wallColor: colors.Blue,
      floorColor: colors.BrightBlue,
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

  async addLeaves() {
    const svgObject = await getSvgObject();
    const smallLeaf = svgObject.getObject(`smallLeaf`);
    const bigLeaf = svgObject.getObject(`bigLeaf`);

    this.leaves = [];
    const meshes = [smallLeaf, bigLeaf];

    meshes.forEach((mesh) => {
      const params = secondStoryConfig[mesh.name];

      const outerGroup = new THREE.Group();
      const fluctuationGroup = new THREE.Group();

      setMeshParams(fluctuationGroup, {scale: params.scale});
      setMeshParams(outerGroup, {rotate: params.rotate});
      setMeshParams(outerGroup, {position: params.position});

      this.leaves.push({root: outerGroup, fluctuation: fluctuationGroup, mesh, params});

      fluctuationGroup.add(mesh);
      outerGroup.add(fluctuationGroup);
      this.add(outerGroup);
    });
  }

  animateLeaves(t) {
    if (!this.leaves || this.leaves.length === 0) {
      return;
    }

    const amps = [0.0192, 0.019];
    const periods = [5.05, 5];

    const points = [new THREE.Vector3(0, -150, 0), new THREE.Vector3(20, -150, 0)];
    const axis = new THREE.Vector3(0, 0, 1);
    const decay = Math.floor(t / LEAVES_ANIMATION_CYCLE_SEC * 100) % 100 < 15 ? 1 : easeOutQuad(t % LEAVES_ANIMATION_CYCLE_SEC);

    this.leaves.forEach((leaf, index) => {
      rotateAboutPoint(leaf.mesh, points[index], axis, -amps[index] * Math.sin((9 * Math.PI * t) / periods[index]) / decay);
    });
  }
}

export default SecondStory;
