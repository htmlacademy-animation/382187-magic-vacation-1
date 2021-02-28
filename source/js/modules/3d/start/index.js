import * as THREE from 'three';

import {WEBGL} from 'three/examples/jsm/WebGL';
import {getLightsConfig} from './config';

import StartStory from './start';

class Start {
  constructor() {
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;

    this.canvasSelector = `start-canvas`;

    this.sceneParams = {
      fov: 35,
      aspect: this.ww / this.wh,
      near: 0.1,
      far: 1405,
      texturePath: `./img/scene-0.png`,
      textureRatio: 2048 / 1024,
      backgroundColor: 0x5f458c,
      position: {
        z: 1405
      }
    };

    this.story = new StartStory();

    this.lights = getLightsConfig(this.sceneParams);

    this.animationRequest = null;

    this.isInitialised = false;

    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);
    this.animate = this.animate.bind(this);
  }

  get fov() {
    if (this.ww > this.wh) {
      return 35;
    }

    return (32 * this.wh) / Math.min(this.ww * 1.3, this.wh);
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

  start() {
    if (!this.isInitialized) {
      if (WEBGL.isWebGLAvailable()) {
        this.init();
        this.isInitialized = true;
      }

      if (!this.animationRequest) {
        this.animationRequest = requestAnimationFrame(this.animate);
      }

      window.addEventListener(`resize`, this.resize);
    }
  }

  init() {
    this.canvasElement = document.getElementById(this.canvasSelector);
    this.canvasElement.width = this.ww;
    this.canvasElement.height = this.wh;

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvasElement});
    this.renderer.setClearColor(this.sceneParams.backgroundColor, 1);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.ww, this.wh);

    this.camera = new THREE.PerspectiveCamera(
        this.sceneParams.fov,
        this.sceneParams.aspect,
        this.sceneParams.near,
        this.sceneParams.far
    );
    this.camera.position.z = this.sceneParams.position.z;

    this.scene = new THREE.Scene();

    this.story.position.z = this.camera.position.z * 0.5;
    this.scene.add(this.story);

    const lightGroup = this.getLightGroup();
    lightGroup.position.z = this.camera.position.z;
    this.scene.add(lightGroup);
  }

  getLightGroup() {
    const lightGroup = new THREE.Group();

    this.lights.forEach((light) => {
      const color = new THREE.Color(light.color);

      const lightUnit = new THREE[light.type](color, light.intensity, light.distance, light.decay);
      lightUnit.position.set(...Object.values(light.position));
      lightGroup.add(lightUnit);
    });

    return lightGroup;
  }

  animate() {
    if (this.animationRequest) {
      requestAnimationFrame(this.animate);
    }

    this.story.update();
    this.render();
  }

  endAnimation() {
    window.removeEventListener(`resize`, this.resize);
    this.animationRequest = null;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

export default Start;
