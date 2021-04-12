import * as THREE from 'three';

import {airplaneConfig} from './config';
import {tick, easeInQuad} from '../../helpers';
import {loadModels} from '../load-object-model';

class Airplane extends THREE.Group {
  constructor() {
    super();

    this.airplane = airplaneConfig;

    this.startTime = -1;
    this.currentTime = -1;

    this._angle = 20;
    this._position = Object.values(airplaneConfig.position);
    this._scale = Object.values(airplaneConfig.scale);

    this.progress = 0;

    this._angleChanged = true;
    this._rotation = 30;
    this._rotationChanged = true;

    this.constructChildren();
  }

  async constructChildren() {
    this.addPlane();
  }

  get planeScale() {
    return this._scale;
  }

  set planeScale(value) {
    this._scale = value;
  }

  get planePosition() {
    return this._position;
  }

  set planePosition(value) {
    this._position = value;
  }

  set planeRotation(value) {
    if (this._rotation === value) {
      return;
    }

    this._rotation = value;
    this._rotationChanged = true;
  }

  get planeRotation() {
    return this._rotation;
  }

  invalidate() {
    if (this.outAxis) {
      this.outAxis.scale.set(...this.planeScale);
      this.outAxis.position.set(...this.planePosition);
    }

    if (this._rotationChanged && this.mesh) {
      this.mesh.rotation.z += (2 * THREE.Math.DEG2RAD * (this.planeRotation));
      this._rotationChanged = false;
    }
  }

  update() {
    if (this.startTime < 0) {
      this.startTime = Date.now();
      this.currentTime = Date.now();

      return;
    }

    const nowT = Date.now();
    const t = (nowT - this.startTime) * 0.001;
    const period = 1.5;

    this.progress = Math.floor(t / 1.9 * 100) / 100;

    if (this.progress > 0.7) {
      this.planeRotation = Math.cos((Math.PI * t) / (period));
    }

    const scaleX = tick(0, 0.6, easeInQuad(this.progress));
    const scaleY = tick(0, 0.6, easeInQuad(this.progress));
    const scaleZ = tick(0, 0.6, easeInQuad(this.progress));

    this.planeScale = [scaleX, scaleY, scaleZ];

    this.planePosition = [
      Math.sin(1.1 * Math.PI * t) * 100 + 80,
      t * t * 25,
      t * 80 - 70,
    ];

    this.currentTime = nowT;
    this.invalidate();
  }

  async addPlane() {
    const meshes = await loadModels([this.airplane]);
    this.mesh = meshes[0];

    const gOuter = new THREE.Group();
    const gInner = new THREE.Group();

    const rotate = this.airplane.rotate;

    gOuter.position.set(...this.planePosition);
    this.mesh.rotation.copy(new THREE.Euler(
        rotate.x * THREE.Math.DEG2RAD, THREE.Math.DEG2RAD * rotate.y, THREE.Math.DEG2RAD * rotate.z, `XYZ`));

    gOuter.add(gInner);
    this.add(gOuter);

    this.inAxis = gInner;
    this.outAxis = gOuter;

    this.mesh.scale.set(0.9, 0.9, 0.9);

    gInner.add(this.mesh);
  }
}

export default Airplane;
