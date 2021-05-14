import * as THREE from 'three';
import TweenState from './tween-state';

class CameraRig extends THREE.Group {

  constructor(settings) {
    super();

    this.settings = settings;

    // Set internal parameters
    this._depth = 0;
    this._dollyLength = settings.dollyLengthStart;
    this._polePosition = settings.radius;
    this._horizonAngle = 0;
    this._depthChanged = true;
    this._dollyLengthChanged = true;
    this._polePositionChanged = true;
    this._horizonAngleChanged = true;
    this.tween = null;

    this.constructRigElements();

    // Set Rig to the initial state
    this.invalidate();
  }

  constructRigElements() {
    // Construct parts
    const depthTrack = new THREE.Group();
    const dollyBend = new THREE.Group();
    const poleHand = new THREE.Group();
    const cameraNull = new THREE.Group();

    // Connect
    this.add(depthTrack);
    depthTrack.add(dollyBend);
    dollyBend.add(poleHand);
    poleHand.add(cameraNull);

    this.depthTrack = depthTrack;
    this.dollyBend = dollyBend;
    this.poleHand = poleHand;
    this.cameraNull = cameraNull;
  }

  set depth(value) {
    if (value === this._depth) {
      return;
    }
    this._depth = value;
    this._depthChanged = true;
  }

  get depth() {
    return this._depth;
  }

  set dollyLength(value) {
    if (value === this._dollyLength) {
      return;
    }
    // dollyLength must be positive
    if (value < 0) {
      this._dollyLength = 0;
      this._dollyLengthChanged = true;

      return;
    }
    this._dollyLength = value;
    this._dollyLengthChanged = true;
  }

  get dollyLength() {
    return this._dollyLength;
  }

  set polePosition(value) {
    if (value === this._polePosition) {
      return;
    }
    this._polePosition = value;
    this._polePositionChanged = true;
  }

  get polePosition() {
    return this._polePosition;
  }

  set horizonAngle(value) {
    if (value === this._horizonAngle) {
      return;
    }
    this._horizonAngle = value;
    this._horizonAngleChanged = true;
  }

  get horizonAngle() {
    return this._horizonAngle;
  }

  invalidate() {
    if (this._depthChanged) {
      this.depthTrack.position.z = -this._depth;
      this._depthChanged = false;
    }

    if (this._horizonAngleChanged) {
      this.depthTrack.rotation.y = this._horizonAngle;
      this._horizonAngleChanged = false;
    }

    if (this._dollyLengthChanged) {
      // Set new position

      this.dollyBend.position.z = this._dollyLength;

      this._dollyLengthChanged = false;
    }

    if (this._polePositionChanged) {
      // Set new position

      this.poleHand.position.y = this._polePosition;

      this._polePositionChanged = false;
    }
  }

  addObjectToCameraNull(object) {
    this.cameraNull.add(object);
  }

  addSuitcase(suitcase) {
    this.depthTrack.add(suitcase);
  }

  update(dt, t) {
    if (this.tween) {
      this.tween.update(dt, t);
    }
    this.invalidate();
  }

  changeStateTo(stateParameters, onComplete) {
    this.tween = new TweenState(this, stateParameters, 1.5, () => {
      this.tween = null;

      if (typeof onComplete === `function`) {
        onComplete.call(null);
      }
    });
  }
}

export default CameraRig;
