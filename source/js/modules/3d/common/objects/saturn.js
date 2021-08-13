import * as THREE from 'three';

import {getLathePointsForCircle} from '../helpers';
import colors from '../colors';
import materialReflectivity from '../material-reflectivity';
import {getMaterial} from '../helpers';
import {setMeshParams, getOriginalRotation} from '../helpers';
import isMobile from '../../../../helpers/is-mobile';
import bezierEasing from '../../../../helpers/bezier-easing';
import {animateEasingWithFramerate} from '../../../../helpers/animation';


export class Saturn extends THREE.Group {
  constructor({dark, basic = false} = {}) {
    super();

    this.dark = dark;
    this.basic = basic;

    this.planet = {
      radius: 60,
      color: this.dark ? colors.ShadowedDominantRed : colors.DominantRed,
      segments: 40,
    };

    this.ring = {
      width: 120 - 80,
      depth: 2,
      radius: 80,
      color: this.dark ? colors.ShadowedBrightPurple : colors.BrightPurple,
      segments: 40,
    };

    this.topSphere = {
      radius: 10,
      color: this.dark ? colors.ShadowedBrightPurple : colors.BrightPurple,
      segments: 40,
    };

    this.line = {
      radius: 1,
      height: 1000,
      color: colors.MetalGrey,
      segments: 40,
    };

    this.constructChildren = this.constructChildren.bind(this);

    this.constructChildren();
  }

  constructChildren() {
    this.addPlanet();
    this.addRing();

    if (!this.basic) {
      this.addTopSphere();
      this.addLine();
    }
  }

  addPlanet() {
    const planet = new THREE.SphereBufferGeometry(this.planet.radius, this.planet.segments, this.planet.segments);
    const mesh = new THREE.Mesh(planet, getMaterial({
      color: this.planet.color,
      ...materialReflectivity.soft,
    }));

    this.add(mesh);
  }

  addRing() {
    const points = getLathePointsForCircle(this.ring.width, this.ring.depth, this.ring.radius);

    const ring = new THREE.LatheBufferGeometry(points, this.ring.segments);
    const mesh = new THREE.Mesh(ring, getMaterial({
      color: this.ring.color,
      side: THREE.DoubleSide,
      flatShading: true,
      ...materialReflectivity.soft,
    }));
    mesh.rotation.copy(new THREE.Euler(20 * THREE.Math.DEG2RAD, 0, 18 * THREE.Math.DEG2RAD), `XYZ`);

    mesh.name = `Ring`;
    this.add(mesh);
  }

  addTopSphere() {
    const sphere = new THREE.SphereBufferGeometry(this.topSphere.radius, this.topSphere.segments, this.topSphere.segments);
    const mesh = new THREE.Mesh(sphere, getMaterial({
      color: this.topSphere.color,
      ...materialReflectivity.soft,
    }));

    mesh.position.set(0, this.ring.radius + this.topSphere.radius + 60, 0);
    this.add(mesh);
  }

  addLine() {
    const line = new THREE.CylinderBufferGeometry(this.line.radius, this.line.radius, this.line.height, this.line.radialSegments);
    const mesh = new THREE.Mesh(line, getMaterial({
      color: this.line.color,
      ...materialReflectivity.soft,
    }));

    mesh.position.set(0, this.line.height / 2, 0);
    this.add(mesh);
  }
}

const easeIn = bezierEasing(0.45, 0.03, 0.85, 0.8);

const count = 8;

const animationSettings = {
  rotate: {
    min: 0,
    max: 10,
  },
  easing: easeIn,
  duration: count * 1000,
};

const pivotParams = {
  position: {x: 0, y: 300, z: 0},
};

const saturnParams = {
  scale: 0.2,
  position: {x: 20, y: 150 - pivotParams.position.y, z: 200},
  ...!isMobile && {
    receiveShadow: true,
    castShadow: true,
  }
};

export const getSaturn = (callback) => {
  const saturnAnimationTick = (object) => {
    return (progress) => {
      const params = calcSaturnParams(progress);
      setMeshParams(object, params);
    };
  };

  const ringAnimationTick = (object, originalRotation) => {
    return (progress) => {
      const params = calcRingParams(progress, originalRotation);
      setMeshParams(object, params);
    };
  };

  const animateSaturn = (object, animationEndCallback) => {
    if (!object) {
      return;
    }

    const {duration, easing} = animationSettings;

    const ring = getRing(object);
    const originalRingRotation = getOriginalRotation(ring);

    setTimeout(() => {
      animateEasingWithFramerate(saturnAnimationTick(object), duration, easing).then(animationEndCallback);
      animateEasingWithFramerate(ringAnimationTick(ring, originalRingRotation), duration, easing);
    }, 1000);
  };

  const saturn = new Saturn();
  setMeshParams(saturn, saturnParams);

  const pivot = new THREE.Group();
  pivot.add(saturn);
  setMeshParams(pivot, pivotParams);

  callback(pivot, animateSaturn);
};

function calcSaturnParams(progress) {
  return {
    rotate: getSaturnRotate(progress),
  };
}

function getSaturnRotate(progress) {
  const {rotate} = animationSettings;
  const amplitude = rotate.max - rotate.min;
  const sine = (1 - progress) * Math.sin(progress * Math.PI * count);
  const z = amplitude * sine;

  return {x: 0, y: 0, z};
}

function calcRingParams(progress, originalRotation) {
  return {
    rotate: getRingRotate(progress, originalRotation),
  };
}

function getRingRotate(progress, originalRotation) {
  const {rotate} = animationSettings;
  const amplitude = rotate.max - rotate.min;
  const sine = (1 - progress) * Math.sin(progress * Math.PI * count);
  const z = amplitude * sine + originalRotation.z * progress;

  return {...originalRotation, z};
}

function getRing(saturn) {
  return saturn.getObjectByName(`Ring`);
}
