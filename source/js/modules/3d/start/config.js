import * as THREE from 'three';

import {reflectivitySettings, colors} from '../common';

export const keyholeConfig = {
  name: `keyhole`,
  position: {x: -1000, y: 1000, z: 0},
};

export const svgsConfig = {
  flamingo: {
    name: `flamingo`,
    scale: {x: 1, y: 1, z: 1},
    finalPosition: {x: -210, y: 150, z: 100},
    position: {x: -15, y: 15, z: 15},
    rotate: {x: 15, y: 170, z: -20},
  },
  snowflake: {
    name: `snowflake`,
    scale: {x: 0.75, y: 0.75, z: 0.75},
    finalPosition: {x: -210, y: 0, z: 100},
    position: {x: 0, y: 0, z: 0},
    rotate: {x: 20, y: 40, z: 0},
  },
  question: {
    name: `question`,
    scale: {x: 0.75, y: 0.75, z: 0.75},
    finalPosition: {x: 60, y: -120, z: 100},
    position: {x: 15, y: -15, z: 10},
    rotate: {x: -30, y: -30, z: 10},
  },
  leaf: {
    name: `leaf`,
    scale: {x: 0.8, y: 0.8, z: 0.8},
    finalPosition: {x: 280, y: 110, z: 100},
    position: {x: 20, y: 15, z: 20},
    rotate: {x: 0, y: -60, z: -70},
  },
};

export const saturnModelConfig = {
  scale: {x: 0.35, y: 0.35, z: 0.35},
  position: {x: 15, y: -15, z: 10},
  finalPosition: {x: 220, y: -50, z: 100},
};

export const modelsConfig = {
  airplane: {
    name: `airplane`,
    type: `obj`,
    path: `3d/obj/airplane.obj`,
    materialReflectivity: reflectivitySettings.basic,
    color: colors.White,
    scale: {x: 0.7, y: 0.7, z: 0.7},
    finalPosition: {x: 120, y: 30, z: 100},
    position: {x: 5, y: 5, z: 5},
    rotate: {x: 135, y: 0, z: 60},
  },
  suitcase: {
    name: `suitcase`,
    type: `gltf`,
    path: `3d/gltf/suitcase.gltf`,
    scale: {x: 0.6, y: 0.6, z: 0.6},
    finalPosition: {x: -50, y: -120, z: 40},
    position: {x: -5, y: -5, z: -5},
    rotate: {x: 20, y: 110, z: 0},
  },
  watermelon: {
    name: `watermelon`,
    type: `gltf`,
    path: `3d/gltf/watermelon.gltf`,
    scale: {x: 1, y: 1, z: 1},
    finalPosition: {x: -370, y: -100, z: 40},
    position: {x: -10, y: -10, z: 5},
    rotate: {x: 0, y: 0, z: 70},
  },
};

export const getLightsConfig = (sceneParams) => (
  [
    {
      id: `DirectionalLight1`,
      type: `DirectionalLight`,
      color: `rgb(255,255,255)`,
      intensity: 0.84,
      position: {x: 0, y: sceneParams.position.z * Math.tan(-15 * THREE.Math.DEG2RAD), z: sceneParams.position.z},
    },
    {
      id: `DirectionalLight2`,
      type: `DirectionalLight`,
      color: `rgb(255,255,255)`,
      intensity: 0.5,
      position: {x: 0, y: 500, z: 0},
    },
    {
      id: `PointLight1`,
      type: `PointLight`,
      color: `rgb(246,242,255)`,
      intensity: 0.60,
      decay: 2.0,
      distance: 975,
      position: {x: -785, y: -350, z: 710},
    },
    {
      id: `PointLight2`,
      type: `PointLight`,
      color: `rgb(245,254,255)`,
      intensity: 0.95,
      decay: 2.0,
      distance: 975,
      position: {x: 730, y: 800, z: 985},
    },
  ]
);
