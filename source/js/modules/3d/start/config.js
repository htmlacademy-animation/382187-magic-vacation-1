import * as THREE from 'three';

export const svgsConfig = [
  {
    name: `flamingo`,
    scale: {x: -1.2, y: 1.2, z: 1.2},
    position: {x: -250, y: 190, z: 100},
    rotate: {x: 210, y: -30, z: -15},
  },
  {
    name: `keyhole`,
    position: {x: -1000, y: 1000, z: 0},
  },
  {
    name: `snowflake`,
    scale: {x: 0.75, y: 0.75, z: 0.75},
    position: {x: -250, y: 20, z: 100},
    rotate: {x: 20, y: 40, z: 0},
  },
  {
    name: `question`,
    scale: {x: 0.75, y: 0.75, z: 0.75},
    position: {x: 60, y: -150, z: 100},
    rotate: {x: -30, y: -30, z: 10},
  },
  {
    name: `leaf-1`,
    scale: {x: 1, y: -1, z: 1},
    position: {x: 350, y: 200, z: 100},
    rotate: {x: 0, y: -20, z: -40},
  },
];

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
