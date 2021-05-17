import * as THREE from 'three';
import TweenState from './tween-state';

import {cameraRigSettings} from './story/config';

class CameraRig extends THREE.Group {

  constructor(settings) {
    super();

    this.settings = settings;

    // Set internal parameters
    this._depth = 0;
    this._dollyLength = settings.dollyLengthStart;
    this._polePosition = settings.radius;
    this._horizonAngle = 0;

    this._pitchAngle = 0;
    this._targetAroundAngle = 0;
    this._targetPitchAngle = 0;

    this._pitchToggled = true;

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
    const suitcaseGroup = new THREE.Group();
    const dollyBend = new THREE.Group();
    const poleHand = new THREE.Group();
    const cameraNull = new THREE.Group();

    // Connect
    this.add(depthTrack);
    this.add(suitcaseGroup);

    depthTrack.add(dollyBend);
    dollyBend.add(poleHand);
    poleHand.add(cameraNull);

    this.depthTrack = depthTrack;
    this.suitcaseGroup = suitcaseGroup;
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

  set pitchToggled(value) {
    this._pitchToggled = value;
  }

  set pitchAngle(value) {
    if (value === this._pitchAngle) {
      return;
    }
    this._pitchAngle = value;
    this._pitchAngleChanged = true;
  }

  get pitchAngle() {
    return this._pitchAngle;
  }

  set targetAroundAngle(value) {
    if (value === this._targetAroundAngle) {
      return;
    }
    this._targetAroundAngle = value;
    this._aroundAngleChanged = true;
  }

  get targetAroundAngle() {
    return this._targetAroundAngle;
  }

  set targetPitchAngle(value) {
    if (value === this._targetPitchAngle) {
      return;
    }
    this._targetPitchAngle = value;
    this._pitchAngleChanged = true;
  }

  get targetPitchAngle() {
    return this._targetPitchAngle;
  }

  invalidate() {
    if (this._depthChanged) {
      this.depthTrack.position.z = -this._depth;
      this._depthChanged = false;
    }

    if (this._horizonAngleChanged) {
      this.depthTrack.rotation.y = this._horizonAngle;
      this.suitcaseGroup.rotation.y = this._horizonAngle;
      this._horizonAngleChanged = false;
    }

    if (this._dollyLengthChanged) {
      this.dollyBend.position.z = this._dollyLength;
      this._dollyLengthChanged = false;
    }

    if (this._polePositionChanged) {
      this.poleHand.position.y = this._polePosition;
      this._polePositionChanged = false;
    }

    if (this._pitchToggled && (this._pitchAngleChanged || this._targetPitchAngle !== this._pitchAngle)) {
      if (Math.abs(this._targetPitchAngle - this._pitchAngle) < 0.001) {
        this._pitchAngle = this._targetPitchAngle;
      } else {
        this._pitchAngle += (this._targetPitchAngle - this._pitchAngle) * 0.15;
      }

      this.dollyBend.rotation.x = this._pitchAngle;
      this._pitchAngleChanged = false;
    }

    this.addMouseListeners();
  }

  addMouseListeners() {
    if (this.hasMousemoveHandler) {
      return;
    }

    const mousemoveHandler = (event) => {
      let pY = event.pageY;
      const winH = window.innerWidth;

      pY /= winH * 0.5;

      this.targetPitchAngle = cameraRigSettings.pitchAmplitude * pY;
    };

    document.addEventListener(`mousemove`, mousemoveHandler);

    this.mousemoveHandler = mousemoveHandler;
    this.hasMousemoveHandler = true;
  }

  addObjectToCameraNull(object) {
    this.cameraNull.add(object);
  }

  addSuitcase(suitcase) {
    this.suitcaseGroup.add(suitcase);
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
