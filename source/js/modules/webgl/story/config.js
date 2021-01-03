import * as THREE from 'three';

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

export const firstStoryConfig = {
  flower: {
    position: {x: -140, y: 75, z: 100},
    rotate: {x: 190, y: -25, z: -5},
    scale: 0.4
  },
  carpet: {
    scale: 0.35,
    position: {x: -20, y: -15, z: 40},
    rotate: {x: 20, y: 45, z: 180}
  },
  saturn: {
    scale: 0.5,
    position: {x: 30, y: 120, z: 100}
  }
};

export const secondStoryConfig = {
  leaf: {
    scale: 0.85,
    position: {x: -115, y: 40, z: 30},
    rotate: {x: 180, y: 3, z: 0}
  },
  pyramid: {
    scale: {x: 1.2, y: 1, z: 1.2},
    position: {x: -10, y: 70, z: -110},
    rotate: {x: 10, y: 3, z: 0}
  },
  lantern: {
    scale: 0.46,
    position: {x: 178, y: -95, z: 10},
    rotate: {x: 12, y: 60, z: 0}
  },
};

export const thirdStoryConfig = {
  snowman: {
    scale: 0.75,
    position: {x: -20, y: -110, z: 0},
    rotate: {x: 10, y: 40, z: 0}
  },
  road: {
    scale: 0.35,
    position: {x: -20, y: -20, z: 60},
    rotate: {x: 20, y: 45, z: 180}
  }
};
