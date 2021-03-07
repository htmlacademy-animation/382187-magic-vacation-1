import * as THREE from 'three';

export const getMaterial = (options = {}) =>{
  const {color, ...other} = options;

  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    ...other,
  });
};

export const setMeshParams = (mesh, params) => {
  if (!mesh) {
    return;
  }
  if (params.position) {
    mesh.position.set(...Object.values(params.position));
  }
  if (typeof params.scale === `number`) {
    mesh.scale.set(params.scale, params.scale, params.scale);
  }
  if (typeof params.scale === `object`) {
    mesh.scale.set(...Object.values(params.scale));
  }
  if (params.rotate) {
    mesh.rotation.copy(new THREE.Euler(
        params.rotate.x * THREE.Math.DEG2RAD,
        params.rotate.y * THREE.Math.DEG2RAD,
        params.rotate.z * THREE.Math.DEG2RAD,
        params.rotationOrder || `XYZ`)
    );
  }
};

export const getLathePointsForCircle = (borderWidth, height, radius) => {
  const points = [];

  for (let i = radius; i <= radius + borderWidth; i++) {
    for (let j = 1; j <= height; j++) {
      points.push(new THREE.Vector2(i, j));
    }
  }

  return points;
};

export const getLatheDegrees = (degStart, degEnd) => {
  const start = THREE.Math.DEG2RAD * degStart;
  const length = THREE.Math.DEG2RAD * (degEnd - degStart);

  return {start, length};
};

export const rotateAboutPoint = (obj, point, axis, theta, pointIsWorld) => {
  pointIsWorld = (pointIsWorld === undefined) ? false : pointIsWorld;

  if (pointIsWorld) {
    obj.parent.localToWorld(obj.position); // compensate for world coordinate
  }

  obj.position.sub(point); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  obj.position.add(point); // re-add the offset

  if (pointIsWorld) {
    obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
  }

  obj.rotateOnAxis(axis, theta); // rotate the OBJECT
};

export const colors = {
  Blue: `rgb(51, 113, 235)`,
  BrightBlue: `rgb(47, 58, 201)`,
  LightBlue: `rgb(150, 176, 243)`,
  DarkBlue: `rgb(12, 49, 112)`,
  SkyLightBlue: `rgb(161, 200, 240)`,
  MountainBlue: `rgb(101, 152, 219)`,
  DominantRed: `rgb(255, 32, 66)`,
  LightDominantRed: `rgb(255, 105, 120)`,
  ShadowedDominantRed: `rgb(124, 26, 48)`,
  Purple: `rgb(163, 118, 235)`,
  BrightPurple: `rgb(118, 76, 225)`,
  LightPurple: `rgb(194, 153, 225)`,
  AdditionalPurple: `rgb(119, 85, 189)`,
  DarkPurple: `rgb(76, 49, 121)`,
  ShadowedPurple: `rgb(75, 50, 116)`,
  ShadowedBrightPurple: `rgb(56, 37, 108)`,
  ShadowedLightPurple: `rgb(77, 53, 106)`,
  ShadowedAdditionalPurple: `rgb(55, 38, 89)`,
  ShadowedDarkPurple: `rgb(49, 42, 71)`,
  Grey: `rgb(118, 125, 143)`,
  MetalGrey: `rgb(126, 141, 164)`,
  Orange: `rgb(230, 80, 0)`,
  Green: `rgb(0, 210, 134)`,
  White: `rgb(255, 255, 255)`,
  SnowColor: `rgb(182, 206, 240)`,
};

export const reflectivitySettings = {
  soft: {
    roughness: 0.7,
    metalness: 0.1,
  },
  basic: {
    roughness: 0.7,
    metalness: 0.2,
  },
  strong: {
    roughness: 0.7,
    metalness: 0.4,
  },
};
