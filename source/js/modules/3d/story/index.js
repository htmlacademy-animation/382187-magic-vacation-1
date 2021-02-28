import * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {tick, easeInOutQuad, animateEasingWithFPS, bezierEasing} from '../../helpers';
import {bubblesParams, getBubblesConfig, getLightsConfig, getTexturesConfig, objectsToAdd} from './config';
import {getMaterial, setMeshParams} from '../common';
import {loadModel} from '../load-object-model';

import FirstStory from './stories/first-story';
import SecondStory from './stories/second-story';
import ThirdStory from './stories/third-story';
import FourthStory from './stories/fourth-story';

const easeInOut = bezierEasing(0.41, 0, 0.54, 1);
const hueIntensityEasingFn = (timingFraction) => {
  return easeInOut(Math.sin(timingFraction * Math.PI));
};

const SUITCASE_SQUASH_ANIMATION_TIME_SEC = 1.3;
const SUITCASE_POSITION_ANIMATION_TIME_SEC = 0.4;

export default class Story {
  constructor() {
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;

    this.centerCoords = {x: this.ww / 2, y: this.wh / 2};

    this.canvasSelector = `story-canvas`;
    this.textures = getTexturesConfig({
      first: new FirstStory(),
      second: new SecondStory(),
      third: new ThirdStory(),
      fourth: new FourthStory()
    });

    this.sceneParams = {
      fov: this.fov,
      aspect: this.ww / this.wh,
      near: 0.1,
      far: 1405,
      textureRatio: 2048 / 1024,
      backgroundColor: 0x5f458c,
      position: {
        z: 1405
      },
      camera: {
        position: {y: 120, z: 300},
        rotation: {y: -15},
      }
    };

    this.suitcase = null;

    this.materials = [];
    this.bubbles = getBubblesConfig(this.centerCoords, this.ww, this.wh);
    this.lights = getLightsConfig(this.sceneParams);

    this.hueIsAnimating = false;
    this.storyIndex = 0;
    this.isInitialised = false;

    this.startTime = -1;

    this.animateHueShift = this.animateHueShift.bind(this);
    this.getHueShiftAnimationSettings = this.getHueShiftAnimationSettings.bind(this);
    this.render = this.render.bind(this);
    this.resize = this.resize.bind(this);
    this.resetHueShift = this.resetHueShift.bind(this);
    this.resetBubbles = this.resetBubbles.bind(this);
    this.animateBubbles = this.animateBubbles.bind(this);
    this.animate = this.animate.bind(this);
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
    return this.wh * this.sceneParams.textureRatio * this.storyIndex;
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

    // const distortedIndex = this.textures.findIndex((texture) => texture.options.distort);

    // const {width} = this.sceneSize;
    // const pixelRatio = this.renderer.getPixelRatio();

    // this.materials[distortedIndex].uniforms.distortion.value.resolution = [
    //   width * pixelRatio, width / this.sceneParams.textureRatio * pixelRatio
    // ];
  }

  getHueShiftAnimationSettings(index) {
    const texture = this.textures[index];
    return texture.animations && texture.animations.hue;
  }

  resetHueShift() {
    const hueAnimationSettings = this.getHueShiftAnimationSettings(this.storyIndex);
    if (!hueAnimationSettings) {
      return;
    }

    this.textures[this.storyIndex].options.hueShift = hueAnimationSettings.initial;
  }

  resetBubbles() {
    this.bubbles.forEach((_, index) => {
      this.bubbles[index].position = [...this.bubbles[index].initialPosition];
    });
    this.materials[1].uniforms.time.value = 0;
  }

  addBubble(index) {
    const {width} = this.sceneSize;
    const pixelRatio = this.renderer.getPixelRatio();

    if (this.textures[index].options.distort) {
      return {
        distortion: {
          value: {
            bubbles: this.bubbles,
            resolution: [width * pixelRatio, width / this.sceneParams.textureRatio * pixelRatio],
          }
        },
      };
    }

    return {};
  }

  getLightGroup() {
    const lightGroup = new THREE.Group();

    this.lights.forEach((light) => {
      const lightUnit = light.light;
      if (light.type === `PointLight`) {
        lightUnit.castShadow = true;
        lightUnit.shadow.mapSize.width = this.ww;
        lightUnit.shadow.mapSize.height = this.wh;
        lightUnit.shadow.camera.near = this.camera.near;
        lightUnit.shadow.camera.far = this.camera.fov;
      }
      lightUnit.position.set(...Object.values(light.position));
      lightGroup.add(lightUnit);
    });

    const ambientLight1 = new THREE.AmbientLight(0x404040);
    const ambientLight2 = new THREE.AmbientLight(0x303030);

    lightGroup.add(ambientLight1);
    lightGroup.add(ambientLight2);

    return lightGroup;
  }

  setCamera() {
    this.camera.position.z = this.sceneParams.camera.position.z;
    this.camera.position.y = this.sceneParams.camera.position.y;
    this.camera.rotation.copy(new THREE.Euler(this.sceneParams.position.z * Math.tan(-15 * THREE.Math.DEG2RAD)), 0, 0, `XYZ`);
  }

  start() {
    if (!this.isInitialized) {
      this.init();
      this.isInitialized = true;
    }

    window.addEventListener(`resize`, this.resize);
  }

  init() {
    this.canvasElement = document.getElementById(this.canvasSelector);
    this.canvasElement.width = this.ww;
    this.canvasElement.height = this.wh;

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvasElement});
    this.renderer.setClearColor(this.sceneParams.backgroundColor, 1);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.ww, this.wh);

    this.camera = new THREE.PerspectiveCamera(this.sceneParams.fov, this.sceneParams.aspect, this.sceneParams.near, this.sceneParams.far);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.setCamera();

    this.renderer.shadowMap.enabled = true;

    this.controls.enableZoom = true;
    this.controls.minPolarAngle = Math.PI * 1 / 4;
    this.controls.maxPolarAngle = Math.PI * 3 / 4;
    this.controls.update();

    this.scene = new THREE.Scene();
    this.camera.lookAt(this.scene.position);

    this.sceneGroup = new THREE.Group();

    this.materials = this.textures.map((story, index) => {

      const models = story.models;

      if (!models) {
        return;
      }

      models.rotation.copy(new THREE.Euler(0, index * 90 * THREE.Math.DEG2RAD, 0, `XYZ`));
      models.scale.set(0.25, 0.25, 0.25);

      this.sceneGroup.add(models);
    });

    this.scene.add(this.sceneGroup);

    this.addSuitcase();

    // Эти объекты добавляются не в самом классе сцены
    this.sceneGroup.children[0].addObject(objectsToAdd.dog);
    this.sceneGroup.children[2].addObject(objectsToAdd.compass);
    this.sceneGroup.children[3].addObject(objectsToAdd.sonya);

    const lightGroup = this.getLightGroup();
    lightGroup.position.z = this.camera.position.z;
    this.scene.add(lightGroup);

    this.changeStory(0);
    this.animate();
  }

  addSuitcase() {
    const params = objectsToAdd.suitcase;
    const material = params.color && getMaterial({color: params.color, ...params.materialReflectivity});

    loadModel(params, material, (mesh) => {
      const outerGroup = new THREE.Group();
      const fluctuationGroup = new THREE.Group();

      mesh.name = params.name;
      mesh.castShadow = params.castShadow;
      mesh.receiveShadow = params.castShadow;

      setMeshParams(fluctuationGroup, {rotate: params.rotate});
      setMeshParams(outerGroup, {scale: params.scale});
      setMeshParams(outerGroup, {position: params.position});

      this.suitcase = {root: outerGroup, fluctation: fluctuationGroup, mesh, params: objectsToAdd.suitcase};

      fluctuationGroup.add(mesh);
      outerGroup.add(fluctuationGroup);
      this.scene.add(outerGroup);
    });
  }

  endAnimation() {
    window.removeEventListener(`resize`, this.resize);
    this.animationRequest = null;
    this.bubbleAnimationRequest = null;
  }

  changeStory(index) {
    this.storyIndex = index;
  }

  hueShiftIntensityAnimationTick(index, from, to) {
    return (progress) => {
      const hueAnimationSettings = this.getHueShiftAnimationSettings(index);
      if (!hueAnimationSettings) {
        this.textures[index].options.hueShift = hueAnimationSettings.initial;
        return;
      }

      const hueShift = tick(from, to, progress);
      this.textures[index].options.hueShift = hueShift;
    };
  }

  animateHueShift() {
    const hueAnimationSettings = this.getHueShiftAnimationSettings(this.storyIndex);
    if (!hueAnimationSettings) {
      this.hueIsAnimating = false;
      return;
    }
    this.hueIsAnimating = true;

    const {initial, final, duration, variation} = hueAnimationSettings;
    const offset = (Math.random() * variation * 2 + (1 - variation));
    animateEasingWithFPS(
        this.hueShiftIntensityAnimationTick(this.storyIndex, initial, final * offset),
        duration * offset,
        hueIntensityEasingFn)
      .then(this.animateHueShift);
  }

  animateBubbles() {
    if (
      this.storyIndex === 1 &&
      this.textures[1].options.distort &&
      this.materials[1].uniforms.time.value < bubblesParams.duration / 1000
    ) {
      this.materials[1].uniforms.time.value += 0.01;
    }
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
        scaleX = scaleZ = 0.05 * 1 / (Math.sqrt(scaleY)) - 0.022;

        this.suitcase.root.scale.set(scaleX, scaleY, scaleZ);
      }
    }
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.animateSuitcase();
    this.render();
  }

  render() {
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  }
}
