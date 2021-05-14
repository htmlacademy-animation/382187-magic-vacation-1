import * as THREE from 'three';

import {tick, easeInOutQuad} from '../../helpers';
import {cameraRigSettings, getBubblesConfig, getLightsConfig, getTexturesConfig, objectsToAdd} from './config';
import {getMaterial, setMeshParams} from '../common';
import {loadModel} from '../load-object-model';
import {getSvgObject} from '../svg-loader';

import StartStory from '../start/start';
import FirstStory from './stories/first-story';
import SecondStory from './stories/second-story';
import ThirdStory from './stories/third-story';
import FourthStory from './stories/fourth-story';

import CameraRig from '../camera-rig';

const SUITCASE_SQUASH_ANIMATION_TIME_SEC = 2.0;
const SUITCASE_POSITION_ANIMATION_TIME_SEC = 1.4;

const getCameraRigStageState = (index, config) => {
  return {
    depth: index === 0 ? 100 : config.deltaDepth,
    dollyLength: config.dollyLength,
    polePosition: config.radius,
    horizonAngle: (index > 0 ? index - 1 : 0) * config.deltaHorizonAngle
  };
};

const ScreenName = {
  start: `start`,
  rooms: `rooms`,
};

const box = new THREE.Box3();
export default class Story {
  constructor() {
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;

    this.centerCoords = {x: this.ww / 2, y: this.wh / 2};

    this.canvasSelector = `start-canvas`;
    this.textures = getTexturesConfig({
      first: new FirstStory(),
      second: new SecondStory(),
      third: new ThirdStory(),
      fourth: new FourthStory()
    });

    this.startStory = new StartStory();

    this.sceneParams = {
      fov: this.fov,
      aspect: this.ww / this.wh,
      near: 0.1,
      far: 2550,
      textureRatio: 2048 / 1024,
      backgroundColor: 0x5f458c,
      position: {
        z: 2550
      },
      camera: {
        position: {y: 800, z: 1950},
        rotation: {y: 15},
      }
    };

    this.cameraRigConfig = cameraRigSettings;

    this.suitcase = null;
    this.dog = null;

    this.materials = [];
    this.bubbles = getBubblesConfig(this.centerCoords, this.ww, this.wh);
    this.lights = getLightsConfig(this.sceneParams);

    this.hueIsAnimating = false;
    this.prevSceneIndex = 0;
    this.sceneIndex = 0;
    this.isInitialised = false;

    this.startTime = -1;
    this.cameraStartTime = -1;
    this.time = -1;

    this.cameraSettings = {
      intro: {
        position: {x: 0, y: 0, z: this.sceneParams.position.z},
        rotation: 0,
      },
      room: {
        position: {x: 0, y: 0, z: 400},
        rotation: 0, // 15
      },
    };

    this.render = this.render.bind(this);
    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);
    this.createStartLight = this.createStartLight.bind(this);
    this.createRoomsLight = this.createRoomsLight.bind(this);

    this.screenLights = {
      [ScreenName.start]: this.createStartLight,
      [ScreenName.rooms]: this.createRoomsLight,
    };
  }

  get sceneSize() {
    const size = new THREE.Vector2();
    this.renderer.getSize(size);
    return size;
  }

  get fov() {
    if (this.ww > this.wh) {
      return 35;
    }

    return (32 * this.wh) / Math.min(this.ww * 1.3, this.wh);
  }

  get scenePosition() {
    return this.wh * this.sceneParams.textureRatio * this.sceneIndex;
  }

  resize() {
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;

    this.canvasElement.width = this.ww;
    this.canvasElement.height = this.wh;

    this.camera.fov = this.fov;
    this.camera.aspect = this.ww / this.wh;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.ww, this.wh);
  }

  createLight(lights) {
    const lightGroup = new THREE.Group();

    lights.forEach(({light, position, castShadow}) => {
      if (position) {
        light.position.set(...Object.values(position));
      }
      if (castShadow) {
        light.castShadow = true;
      }
      lightGroup.add(light);
    });

    return lightGroup;
  }

  createStartLight() {
    const light = this.createLight(this.lights.start);
    light.name = `light-${ScreenName.start}`;

    return light;
  }

  createRoomsLight() {
    const light = this.createLight(this.lights.rooms);
    light.name = `light-${ScreenName.rooms}`;

    return light;
  }

  setLight() {
    const [current, previous] = this.sceneIndex === 0 ? [ScreenName.start, ScreenName.rooms] : [ScreenName.rooms, ScreenName.start];

    const currentLight = this.scene.getObjectByName(`light-${current}`);
    const previousLight = this.scene.getObjectByName(`light-${previous}`);

    if (currentLight) {
      currentLight.visible = true;
    } else {
      const light = this.screenLights[current]();
      this.scene.add(light);
      this.rig.addObjectToCameraNull(light);
    }

    if (previousLight) {
      previousLight.visible = false;
    }
  }

  setCamera() {
    this.camera.position.z = this.sceneParams.camera.position.z;
    this.camera.position.y = this.sceneParams.camera.position.y;
  }

  start() {
    if (!this.isInitialized) {
      this.init();
      this.initialized = true;
      this.scene.visible = false;
      getSvgObject().then(() => {
        this.scene.visible = true;
        this.animate();
      });
    }

    window.addEventListener(`resize`, this.resize);
  }

  init() {
    this.canvasElement = document.getElementById(this.canvasSelector);
    this.canvasElement.width = this.ww;
    this.canvasElement.height = this.wh;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasElement,
      powerPreference: `high-performance`
    });
    this.renderer.setClearColor(this.sceneParams.backgroundColor, 1);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.ww, this.wh);

    this.camera = new THREE.PerspectiveCamera(this.sceneParams.fov, this.sceneParams.aspect, this.sceneParams.near, this.sceneParams.far);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.setCamera();

    this.scene = new THREE.Scene();

    // Add the Camera Rig
    this.rig = new CameraRig(this.cameraRigConfig);
    this.rig.addObjectToCameraNull(this.camera);
    this.scene.add(this.rig);

    this.storyGroup = new THREE.Group();

    this.materials = this.textures.map((story, index) => {
      const models = story.models;

      if (!models) {
        return;
      }

      models.rotation.copy(new THREE.Euler(0, index * 90 * THREE.Math.DEG2RAD, 0, `XYZ`));
      models.scale.set(1, 1, 1);
      this.storyGroup.add(models);
    });

    this.startStory.position.z = 4050;
    this.startStory.position.y = -450;

    box.setFromObject(this.storyGroup);
    box.getCenter(this.storyGroup.position); // this re-sets the mesh position
    this.storyGroup.position.multiplyScalar(-1);

    this.storyGroup.visible = false;

    this.pivot = new THREE.Group();
    this.scene.add(this.pivot);
    this.pivot.add(this.storyGroup);
    this.pivot.add(this.startStory);
    this.pivot.position.z = 0;
    this.pivot.position.y = 1250;

    this.addSuitcase();
    this.setLight();
  }

  addSuitcase() {
    const params = objectsToAdd.suitcase;
    const material = params.color && getMaterial({color: params.color, ...params.materialReflectivity});

    loadModel(params, material, (mesh) => {
      const outerGroup = new THREE.Group();
      outerGroup.castShadow = params.castShadow;
      outerGroup.receiveShadow = params.receiveShadow;
      const fluctuationGroup = new THREE.Group();

      setMeshParams(fluctuationGroup, {rotate: params.rotate});
      setMeshParams(outerGroup, {scale: params.scale});
      setMeshParams(outerGroup, {position: params.position});

      this.suitcase = {root: outerGroup, fluctation: fluctuationGroup, mesh, params: objectsToAdd.suitcase};

      fluctuationGroup.add(mesh);
      outerGroup.add(fluctuationGroup);
      this.rig.addSuitcase(outerGroup);
    });
  }

  endAnimation() {
    window.removeEventListener(`resize`, this.resize);
    this.animationRequest = null;
    this.bubbleAnimationRequest = null;
  }

  changeScene(index) {
    this.prevSceneIndex = this.sceneIndex;
    this.sceneIndex = index;
    this.setLight();

    if (this.sceneIndex > 0) {
      this.rig.changeStateTo(getCameraRigStageState(index, this.cameraRigConfig));

      if (this.prevSceneIndex === 0 && this.sceneIndex === 1) {
        this.storyGroup.visible = false;
        this.rig.pitchToggled = false;
        setTimeout(() => {
          this.rig.pitchToggled = true;
          this.storyGroup.visible = true;
          this.startStory.visible = false;
        }, 400);
      }
    }

    if (this.sceneIndex === 0) {
      this.startStory.visible = true;
      this.storyGroup.visible = false;
    }

    this.renderer.render(this.scene, this.camera);
  }

  animateSuitcase() {
    if (this.suitcase) {
      if (this.startTime < 0) {
        this.startTime = new THREE.Clock();
        return;
      }

      const t = this.startTime.getElapsedTime();
      const params = this.suitcase.params;

      // Анимируем падение
      if (t < SUITCASE_POSITION_ANIMATION_TIME_SEC) {
        const positionY = tick(params.position.y, params.finalPosition.y, 1);
        const position = [params.finalPosition.x, positionY, params.finalPosition.z];

        this.suitcase.root.position.set(...position);
      // Анимируем сжатие / растяжение
      } else if (t > SUITCASE_POSITION_ANIMATION_TIME_SEC && t < SUITCASE_SQUASH_ANIMATION_TIME_SEC) {
        let scaleX;
        let scaleY;
        let scaleZ;

        scaleY = tick(params.scale.y, params.finalScale.y, easeInOutQuad(t));
        scaleX = scaleZ = 1 / (Math.sqrt(scaleY)) + 0.002;

        this.suitcase.root.scale.set(scaleX, scaleY, scaleZ);
      }
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    const nowT = Date.now();

    if (this.cameraStartTime < 0) {
      this.cameraStartTime = this.time = nowT;

      return;
    }

    const t = (nowT - this.cameraStartTime) * 0.001;
    const dt = (nowT - this.time) * 0.001;

    this.rig.update(dt, t);

    this.time = nowT;

    this.animateScene(this.sceneIndex);
    this.render();
  }

  animateScene(index) {
    switch (index) {
      case 0:
        this.startStory.update();
        break;
      case 1:
        this.animateSuitcase();
        this.storyGroup.children[0].update();
        break;
      case 2:
        this.storyGroup.children[1].update();
        break;
      case 3:
        this.storyGroup.children[2].update();
        break;
      case 4:
        this.storyGroup.children[3].update();
        break;
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
