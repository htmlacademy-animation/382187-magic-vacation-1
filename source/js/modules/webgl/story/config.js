import * as THREE from 'three';
import {getSquareRadius} from '../../helpers';

export const lanternConfig = {
  topCap: {
    widthTop: 45,
    widthBottom: 57,
    height: 6,
    color: `#376ee0`,
    radialSegments: 4,
  },
  topTrapezoid: {
    widthTop: 42,
    widthBottom: 34,
    height: 60,
    color: `#9db3ef`,
    radialSegments: 4,
  },
  topBox: {
    width: 37,
    height: 4,
    color: `#376ee0`,
  },
  middleCylinder: {
    height: 230,
    radius: 7,
    radialSegments: 20,
    color: `#376ee0`,
  },
  baseSphere: {
    height: 16,
    radius: 16,
    segments: 20,
    color: `#376ee0`,
  },
  baseCylinder: {
    height: 120,
    radius: 16,
    radialSegments: 20,
    color: `#376ee0`,
  }
};

export const pyramidConfig = {
  height: 280,
  radius: getSquareRadius(250),
  radialSegments: 4,
  color: `#1960cf`,
};

export const snowmanConfig = {
  topSphere: {
    radius: 44,
    segments: 20,
    color: `#bccde6`,
  },
  cone: {
    radius: 18,
    height: 75,
    radialSegments: 20,
    color: `#c44717`,
  },
  baseSphere: {
    radius: 75,
    segments: 20,
    color: `#bccde6`,
  },
};

export const bubblesParams = {
  duration: 2100,
  glareOffset: 0.8,
  startRadianAngle: 1.96,
  endRadianAngle: 2.75
};

export const getBubblesConfig = (centerCoords, ww, wh) => (
  [
    {
      radius: 80.0,
      initialPosition: [centerCoords.x - centerCoords.x / 10, -100],
      position: [centerCoords.x - centerCoords.x / 10, -100],
      finalOffset: [0, wh + 200],
      positionAmplitude: 60,
      glareOffset: bubblesParams.glareOffset,
      glareAngleStart: bubblesParams.startRadianAngle,
      glareAngleEnd: bubblesParams.endRadianAngle,
      timeout: 0.05
    },
    {
      radius: 60.0,
      initialPosition: [centerCoords.x - ww / 6, -100],
      position: [centerCoords.x - ww / 6, -100],
      finalOffset: [0, wh + 200],
      positionAmplitude: 40,
      glareOffset: bubblesParams.glareOffset,
      glareAngleStart: bubblesParams.startRadianAngle,
      glareAngleEnd: bubblesParams.endRadianAngle,
      timeout: 0.70
    },
    {
      radius: 40.0,
      initialPosition: [centerCoords.x + 150, -100],
      position: [centerCoords.x + 150, -100],
      finalOffset: [0, wh + 200],
      positionAmplitude: 30,
      glareOffset: bubblesParams.glareOffset,
      glareAngleStart: bubblesParams.startRadianAngle,
      glareAngleEnd: bubblesParams.endRadianAngle,
      timeout: 0.90
    },
  ]
);

export const getLightsConfig = (sceneParams) => (
  [
    {
      id: `DirectionalLight`,
      type: `DirectionalLight`,
      color: `rgb(255,255,255)`,
      intensity: 0.84,
      position: {x: 0, y: sceneParams.position.z * Math.tan(-15 * THREE.Math.DEG2RAD), z: sceneParams.position.z},
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

export const getTexturesConfig = (storyModels) => (
  [
    {
      src: `./img/scene-1.png`,
      options: {hueShift: 0.0, distort: false},
      models: storyModels.first
    },
    {
      src: `./img/scene-2.png`,
      options: {hueShift: -0.25, distort: true},
      animations: {
        hue: {
          initial: -0.1,
          final: -0.25,
          duration: 2000,
          variation: 0.4,
        },
      },
      models: storyModels.second
    },
    {
      src: `./img/scene-3.png`,
      options: {hueShift: 0.0, distort: false},
      models: storyModels.third
    },
    {
      src: `./img/scene-4.png`,
      options: {hueShift: 0.0, distort: false},
      models: storyModels.fourth
    }
  ]
);
