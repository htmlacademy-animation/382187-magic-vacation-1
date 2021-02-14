import * as THREE from 'three';

import {colors} from '../common';

export const bubblesParams = {
  duration: 2100,
  glareOffset: 0.8,
  startRadianAngle: 1.96,
  endRadianAngle: 2.75
};

export const getBubblesConfig = (centerCoords, ww, wh) => ([
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
]);

export const getLightsConfig = (sceneParams) => ([
  {
    id: `DirectionalLight1`,
    type: `DirectionalLight`,
    color: `rgb(255,255,255)`,
    intensity: 0.84,
    light: new THREE.DirectionalLight(new THREE.Color(colors.White), 0.84),
    position: {x: 0, y: sceneParams.position.z * Math.tan(-15 * THREE.Math.DEG2RAD), z: sceneParams.position.z},
  },
  {
    id: `DirectionalLight2`,
    type: `DirectionalLight`,
    color: `rgb(255,255,255)`,
    intensity: 0.7,
    light: new THREE.DirectionalLight(new THREE.Color(colors.White), 0.7),
    position: {x: 0, y: 500, z: 0},
  },
  {
    id: `PointLight1`,
    type: `PointLight`,
    color: `rgb(246,242,255)`,
    intensity: 0.80,
    decay: 2.0,
    distance: 975,
    light: new THREE.PointLight(new THREE.Color(`rgb(246,242,255)`), 0.8, 975, 2.0),
    position: {x: -785, y: -250, z: 710},
  },
  {
    id: `PointLight2`,
    type: `PointLight`,
    color: `rgb(245,254,255)`,
    intensity: 0.95,
    decay: 2.0,
    distance: 975,
    light: new THREE.PointLight(new THREE.Color(`rgb(245,254,255)`), 0.95, 975, 2.0),
    position: {x: 730, y: 800, z: 985},
  },
]);

export const getTexturesConfig = (storyModels) => (
  [
    {
      // src: `./img/scene-1.png`,
      options: {hueShift: 0.0, distort: false},
      models: storyModels.first
    },
    {
      // src: `./img/scene-2.png`,
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
      // src: `./img/scene-3.png`,
      options: {hueShift: 0.0, distort: false},
      models: storyModels.third
    },
    {
      // src: `./img/scene-4.png`,
      options: {hueShift: 0.0, distort: false},
      models: storyModels.fourth
    }
  ]
);

export const firstStoryConfig = {
  models: [
    {
      name: `static`,
      type: `gltf`,
      path: `3d/gltf/scene1-static-output-1.gltf`,
      scale: 0.55,
      position: {x: -20, y: 0, z: 5},
      rotate: {x: 0, y: -45, z: 0},
    },
  ],
  flower: {
    position: {x: -170, y: 215, z: 185},
    rotate: {x: 0, y: 45, z: 0},
    scale: {x: 0.5, y: -0.5, z: 0.5}
  },
  carpet: {
    scale: 0.6,
    position: {x: 0, y: 2, z: 0},
    rotate: {x: 0, y: 45, z: 180}
  },
  saturn: {
    scale: 0.6,
    position: {x: 50, y: 300, z: 250},
    rotate: {x: -15, y: 0, z: 0}
  }
};

export const secondStoryConfig = {
  models: [
    {
      name: `static`,
      type: `gltf`,
      path: `3d/gltf/scene2-static-output-1.gltf`,
      scale: 0.55,
      position: {x: 0, y: 0, z: 5},
      rotate: {x: 0, y: -45, z: 0},
    },
    {
      name: `suitcase`,
      type: `gltf`,
      path: `3d/gltf/suitcase.gltf`,
      scale: 0.5,
      position: {x: -180, y: 5, z: 460},
      rotate: {x: 0, y: -20, z: 0},
    },
  ],
  leaf1: {
    scale: {x: 0.85, y: -0.85, z: 0.85},
    position: {x: -120, y: 100, z: 180},
    rotate: {x: 0, y: 30, z: 0}
  },
  pyramid: {
    scale: 0.55,
    position: {x: 10, y: 80, z: 190},
    rotate: {x: 0, y: 0, z: 0}
  },
  lantern: {
    scale: 0.5,
    position: {x: 230, y: 40, z: 350},
    rotate: {x: 0, y: 45, z: 0}
  },
};

export const thirdStoryConfig = {
  models: [
    {
      name: `static`,
      type: `gltf`,
      path: `3d/gltf/scene3-static-output-1.gltf`,
      scale: 0.55,
      position: {x: 0, y: 0, z: 5},
      rotate: {x: 0, y: -45, z: 0},
    },
  ],
  snowman: {
    scale: 0.65,
    position: {x: -70, y: 70, z: 250},
    rotate: {x: 10, y: 40, z: 0}
  },
  road: {
    scale: 0.6,
    position: {x: 0, y: 2, z: 0},
    rotate: {x: 0, y: 45, z: 180}
  }
};

export const fourthStoryConfig = {
  models: [
    {
      name: `static`,
      type: `gltf`,
      path: `3d/gltf/scene4-static-output-1.gltf`,
      scale: 0.55,
      position: {x: 0, y: 0, z: 5},
      rotate: {x: 0, y: -45, z: 0},
    },
    {
      name: `suitcase`,
      type: `gltf`,
      path: `3d/gltf/suitcase.gltf`,
      castShadow: true,
      receiveShadow: true,
      scale: 0.5,
      position: {x: -200, y: 5, z: 475},
      rotate: {x: 0, y: -25, z: 0},
    },
  ],
  flower: {
    position: {x: -170, y: 215, z: 185},
    rotate: {x: 0, y: 45, z: 0},
    scale: {x: 0.5, y: -0.5, z: 0.5}
  },
  carpet: {
    scale: 0.6,
    position: {x: 0, y: 2, z: 0},
    rotate: {x: 0, y: 45, z: 180}
  },
  saturn: {
    scale: 0.6,
    position: {x: 50, y: 300, z: 250},
    rotate: {x: -15, y: 0, z: 0}
  }
};

export const objectsToAdd = {
  suitcase: {
    name: `suitcase`,
    type: `gltf`,
    path: `3d/gltf/suitcase.gltf`,
    castShadow: true,
    receiveShadow: true,
    scale: 0.12,
    position: {x: -50, y: 5, z: 130},
    rotate: {x: 0, y: -20, z: 0},
  },
  dog: {
    name: `static`,
    type: `gltf`,
    path: `3d/gltf/dog.gltf`,
    castShadow: true,
    receiveShadow: true,
    scale: 0.55,
    position: {x: 40, y: 0, z: 380},
    rotate: {x: 0, y: 15, z: 0},
  },
  compass: {
    name: `static`,
    type: `gltf`,
    path: `3d/gltf/compass.gltf`,
    castShadow: true,
    receiveShadow: true,
    scale: 0.55,
    position: {x: -10, y: 0, z: 10},
    rotate: {x: 0, y: -45, z: 0},
  },
  sonya: {
    name: `static`,
    type: `gltf`,
    path: `3d/gltf/sonya.gltf`,
    castShadow: true,
    receiveShadow: true,
    scale: 0.55,
    position: {x: 40, y: 40, z: 300},
    rotate: {x: 0, y: -45, z: 0},
  }
};
