import * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {tick, easeInOutQuad} from '../../helpers';
import {getBubblesConfig, getLightsConfig, getTexturesConfig, objectsToAdd} from './config';
import {getMaterial, setMeshParams} from '../common';
import {loadModel} from '../load-object-model';

import FirstStory from './stories/first-story';
import SecondStory from './stories/second-story';
import ThirdStory from './stories/third-story';
import FourthStory from './stories/fourth-story';

const SUITCASE_SQUASH_ANIMATION_TIME_SEC = 1.1;
const SUITCASE_POSITION_ANIMATION_TIME_SEC = 0.3;

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
      far: 2550,
      textureRatio: 2048 / 1024,
      backgroundColor: 0x5f458c,
      position: {
        z: 2550
      },
      camera: {
        position: {y: 800, z: 1950},
        rotation: {y: -15},
      }
    };

    this.suitcase = null;
    this.dog = null;

    this.materials = [];
    this.bubbles = getBubblesConfig(this.centerCoords, this.ww, this.wh);
    this.lights = getLightsConfig(this.sceneParams);

    this.hueIsAnimating = false;
    this.storyIndex = 0;
    this.isInitialised = false;

    this.startTime = -1;

    this.render = this.render.bind(this);
    this.resize = this.resize.bind(this);
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
        lightUnit.shadow.camera.far = this.camera.far;
      }
      lightUnit.position.set(...Object.values(light.position));
      lightGroup.add(lightUnit);
    });

    const ambientLight1 = new THREE.AmbientLight(0x404040);


    lightGroup.add(ambientLight1);

    return lightGroup;
  }

  setCamera() {
    this.camera.position.z = this.sceneParams.camera.position.z;
    this.camera.position.y = this.sceneParams.camera.position.y;
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

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasElement,
      powerPreference: `high-performance`
    });
    this.renderer.setClearColor(this.sceneParams.backgroundColor, 1);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.ww, this.wh);

    this.camera = new THREE.PerspectiveCamera(this.sceneParams.fov, this.sceneParams.aspect, this.sceneParams.near, this.sceneParams.far);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.setCamera();

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.controls.enableZoom = false;
    this.controls.minPolarAngle = Math.PI * 1 / 4;
    this.controls.maxPolarAngle = Math.PI * 2 / 5;
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
      models.scale.set(1, 1, 1);

      this.sceneGroup.add(models);
    });

    this.scene.add(this.sceneGroup);

    this.addSuitcase();

    const lightGroup = this.getLightGroup();
    this.scene.add(lightGroup);

    this.changeStory(0);
    this.animate();
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
    this.controls.update();
    this.animateSuitcase();

    // TODO Base logic on index
    this.sceneGroup.children[0].update();
    this.sceneGroup.children[1].update();
    this.sceneGroup.children[2].update();
    this.sceneGroup.children[3].update();

    this.render();
  }

  render() {
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  }
}
