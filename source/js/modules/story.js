import * as THREE from 'three';
import {prepareStoryRawShaderMaterial} from './shaders';
import {tick, animateEasingWithFPS, bezierEasing} from './helpers';

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
    this.textures = [
      {src: `./img/scene-1.png`, options: {hueShift: 0.0, distort: false}},
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
        }
      },
      {src: `./img/scene-3.png`, options: {hueShift: 0.0, distort: false}},
      {src: `./img/scene-4.png`, options: {hueShift: 0.0, distort: false}}
    ];
    this.textureRatio = 2048 / 1024;
    this.backgroundColor = 0x5f458c;

    this.sceneParams = {
      fov: 45,
      aspect: this.ww / this.wh,
      near: 0.1,
      far: 1000,
      position: {
        z: 800
      }
    };

    this.materials = [];

    this.bubblesParams = {
      duration: 2000,
      glareOffset: 0.8,
      startRadianAngle: 1.96,
      endRadianAngle: 2.75
    };

    this.bubbles = [
      {
        radius: 80.0,
        initialPosition: [this.centerCoords.x, -100],
        position: [this.centerCoords.x - this.centerCoords.x / 10, -100],
        finalPosition: [this.centerCoords.x - this.centerCoords.x / 10, this.wh + 100],
        positionAmplitude: 60,
        glareOffset: this.bubblesParams.glareOffset,
        glareAngleStart: this.bubblesParams.startRadianAngle,
        glareAngleEnd: this.bubblesParams.endRadianAngle,
        timeout: 0.05
      },
      {
        radius: 60.0,
        initialPosition: [this.centerCoords.x - this.ww / 4, -100],
        position: [this.centerCoords.x - this.ww / 4, -100],
        finalPosition: [this.centerCoords.x - this.ww / 4, this.wh + 100],
        positionAmplitude: 40,
        glareOffset: this.bubblesParams.glareOffset,
        glareAngleStart: this.bubblesParams.startRadianAngle,
        glareAngleEnd: this.bubblesParams.endRadianAngle,
        timeout: 0.25
      },
      {
        radius: 40.0,
        initialPosition: [this.centerCoords.x + 150, -100],
        position: [this.centerCoords.x + 150, -100],
        finalPosition: [this.centerCoords.x + 150, this.wh + 100],
        positionAmplitude: 30,
        glareOffset: this.bubblesParams.glareOffset,
        glareAngleStart: this.bubblesParams.startRadianAngle,
        glareAngleEnd: this.bubblesParams.endRadianAngle,
        timeout: 0.35
      },
    ];

    this.hueIsAnimating = false;
    this.animationRequest = null;
    this.storyIndex = 0;

    this.animateHueShift = this.animateHueShift.bind(this);
    this.getHueShiftAnimationSettings = this.getHueShiftAnimationSettings.bind(this);
    this.render = this.render.bind(this);
    this.resize = this.resize.bind(this);
    this.animateBubbles = this.animateBubbles.bind(this);
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

    const size = new THREE.Vector2();
    const {width} = this.renderer.getSize(size);
    const pixelRatio = this.renderer.getPixelRatio();

    this.materials[distortedIndex].uniforms.distortion.value.resolution = [width * pixelRatio, width / this.textureRatio * pixelRatio];
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
            resolution: [width * pixelRatio, width / this.textureRatio * pixelRatio],
          }
        },
      };
    }

    return {};
  }

  init() {
    window.addEventListener(`resize`, this.resize);
    this.canvasElement = document.getElementById(this.canvasSelector);
    this.canvasElement.width = this.ww;
    this.canvasElement.height = this.wh;

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvasElement});
    this.renderer.setClearColor(this.backgroundColor, 1);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.ww, this.wh);

    this.camera = new THREE.PerspectiveCamera(this.sceneParams.fov, this.sceneParams.aspect, this.sceneParams.near, this.sceneParams.far);
    this.camera.position.z = this.sceneParams.position.z;

    this.scene = new THREE.Scene();

    const loadManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadManager);
    const loadedTextures = this.textures.map((texture) => ({src: textureLoader.load(texture.src), options: texture.options}));
    const geometry = new THREE.PlaneGeometry(1, 1);

    loadManager.onLoad = () => {
      this.materials = loadedTextures.map((loadedTexture, index) => {
        const rawShaderMaterialAttrs = prepareStoryRawShaderMaterial({
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
        image.scale.x = this.wh * this.textureRatio;
        image.scale.y = this.wh;
        image.position.x = this.getScenePosition(index);

        this.scene.add(image);

        return material;
      });
    };

    this.changeStory(0);
  }

  endAnimation() {
    window.removeEventListener(`resize`, this.resize);
    this.animationRequest = null;
  }

  changeStory(index) {
    this.storyIndex = index;
    this.camera.position.x = this.getScenePosition(index);
    this.animationRequest = requestAnimationFrame(this.render);

    if (this.textures[index].options.distort) {
      this.resetBubbles();
      this.animateBubbles();
    }

    if (this.getHueShiftAnimationSettings(index)) {
      if (!this.hueIsAnimating) {
        this.resetHueShift();
        this.animateHueShift();
      }
    }
  }

  getScenePosition(index) {
    return this.wh * this.textureRatio * index;
  }

  bubblePositionAnimationTick(index, from, to) {
    return (progress) => {
      const pixelRatio = this.renderer.getPixelRatio();

      const y = tick(from[1], to[1], progress) * pixelRatio;
      const offset = this.bubbles[index].positionAmplitude * Math.pow(1 - progress, 0.8) * Math.sin(progress * Math.PI * 7);
      const x = (offset + this.bubbles[index].initialPosition[0]) * pixelRatio;

      this.bubbles[index].position = [x, y];
    };
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
    animateEasingWithFPS(this.hueShiftIntensityAnimationTick(this.storyIndex, initial, final * offset), duration * offset, hueIntensityEasingFn)
      .then(this.animateHueShift);
  }

  animateBubbles() {
    if (this.materials[1].uniforms.time.value < this.bubblesParams.duration / 1000) {
      this.materials[1].uniforms.time.value += 0.01;
      requestAnimationFrame(this.animateBubbles);
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    if (this.animationRequest) {
      requestAnimationFrame(this.render);
    }
  }
}
