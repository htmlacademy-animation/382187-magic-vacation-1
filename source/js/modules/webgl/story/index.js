import * as THREE from 'three';

import prepareRawShaderMaterial from '../shaders/story';
import {tick, animateEasingWithFPS, bezierEasing} from '../../helpers';
import {bubblesParams, getBubblesConfig, getLightsConfig, getTexturesConfig} from './config';
import FirstStory from './stories/first-story';
import SecondStory from './stories/second-story';
import ThirdStory from './stories/third-story';
import FourthStory from './stories/fourth-story';

const easeInOut = bezierEasing(0.41, 0, 0.54, 1);
const hueIntensityEasingFn = (timingFraction) => {
  return easeInOut(Math.sin(timingFraction * Math.PI));
};

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
      fov: 35,
      aspect: this.ww / this.wh,
      near: 0.1,
      far: 1000,
      textureRatio: 2048 / 1024,
      backgroundColor: 0x5f458c,
      position: {
        z: 750
      }
    };

    this.materials = [];
    this.bubbles = getBubblesConfig(this.centerCoords, this.ww, this.wh);
    this.lights = getLightsConfig(this.sceneParams);

    this.hueIsAnimating = false;
    this.storyIndex = 0;
    this.isInitialised = false;

    this.animateHueShift = this.animateHueShift.bind(this);
    this.getHueShiftAnimationSettings = this.getHueShiftAnimationSettings.bind(this);
    this.render = this.render.bind(this);
    this.resize = this.resize.bind(this);
    this.resetHueShift = this.resetHueShift.bind(this);
    this.resetBubbles = this.resetBubbles.bind(this);
    this.animateBubbles = this.animateBubbles.bind(this);
    this.animate = this.animate.bind(this);
  }

  resize() {
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;

    this.canvasElement.width = this.ww;
    this.canvasElement.height = this.wh;

    this.camera.aspect = this.ww / this.wh;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.ww, this.wh);

    const distortedIndex = this.textures.findIndex((texture) => texture.options.distort);

    const target = new THREE.Vector2();
    const {width} = this.renderer.getSize(target);
    const pixelRatio = this.renderer.getPixelRatio();

    this.materials[distortedIndex].uniforms.distortion.value.resolution = [
      width * pixelRatio, width / this.sceneParams.textureRatio * pixelRatio
    ];
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
    const size = new THREE.Vector2();
    const {width} = this.renderer.getSize(size);
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
      const color = new THREE.Color(light.color);

      const lightUnit = new THREE[light.type](color, light.intensity, light.distance, light.decay);
      lightUnit.position.set(...Object.values(light.position));
      lightGroup.add(lightUnit);
    });

    const ambientLight = new THREE.AmbientLight(0x505050);
    lightGroup.add(ambientLight);

    return lightGroup;
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
    this.camera.position.z = this.sceneParams.position.z;

    this.scene = new THREE.Scene();

    const loadManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadManager);
    const loadedTextures = this.textures.map((texture) => ({...texture, src: textureLoader.load(texture.src)}));
    const geometry = new THREE.PlaneGeometry(1, 1);

    loadManager.onLoad = () => {
      this.materials = loadedTextures.map((loadedTexture, index) => {
        const rawShaderMaterialAttrs = prepareRawShaderMaterial({
          map: {
            value: loadedTexture.src,
          },
          options: {
            value: loadedTexture.options,
          },
          time: {
            value: 0
          },
          ...this.addBubble(index),
        });

        const material = new THREE.RawShaderMaterial(rawShaderMaterialAttrs);

        material.needsUpdate = true;

        const image = new THREE.Mesh(geometry, material);
        image.scale.x = this.wh * this.sceneParams.textureRatio / (1024 / this.wh);
        image.scale.y = this.wh / (1024 / this.wh);
        image.position.x = this.getScenePosition(index);

        this.scene.add(image);

        if (loadedTexture.models) {
          loadedTexture.models.position.x = this.getScenePosition(index);
          this.scene.add(loadedTexture.models);
        }

        return material;
      });
    };

    const lightGroup = this.getLightGroup();
    lightGroup.position.z = this.camera.position.z;
    this.scene.add(lightGroup);

    this.changeStory(0);
    this.animate();
  }

  endAnimation() {
    window.removeEventListener(`resize`, this.resize);
    this.animationRequest = null;
    this.bubbleAnimationRequest = null;
  }

  changeStory(index) {
    this.storyIndex = index;
    this.camera.position.x = this.getScenePosition(index);
  }

  getScenePosition(index) {
    return this.wh * this.sceneParams.textureRatio * index;
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

  animate() {
    requestAnimationFrame(this.animate);

    this.animateBubbles();
    if (this.getHueShiftAnimationSettings(this.storyIndex)) {
      if (!this.hueIsAnimating) {
        this.resetHueShift();
        this.animateHueShift();
      }
    }

    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
