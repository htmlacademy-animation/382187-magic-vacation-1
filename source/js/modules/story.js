import * as THREE from 'three';
import {prepareStoryRawShaderMaterial} from './shaders';

export default class Story {
  constructor() {
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;

    this.centerCoords = {x: this.ww / 2, y: this.wh / 2};

    this.canvasSelector = `story-canvas`;
    this.textures = [
      {src: `./img/scene-1.png`, options: {hueShift: 0.0, distort: false}},
      {src: `./img/scene-2.png`, options: {hueShift: -0.25, distort: true}},
      {src: `./img/scene-3.png`, options: {hueShift: 0.0, distort: false}},
      {src: `./img/scene-4.png`, options: {hueShift: 0.0, distort: false}}
    ];
    this.textureRatio = 2048 / 1024;
    this.backgroundColor = 0x5f458c;

    this.fov = 45;
    this.aspect = this.ww / this.wh;
    this.near = 0.1;
    this.far = 1000;
    this.position = {
      z: 800,
    };

    this.bubblesDuration = 5000;
    this.bubbleGlareOffset = 0.8;
    this.bubbleStartRadianAngle = 1.96;
    this.bubbleEndRadianAngle = 2.75;

    this.bubbles = [
      {
        radius: 100.0,
        position: [this.centerCoords.x - 50, 450],
        positionAmplitude: 50,
        glareOffset: this.bubbleGlareOffset,
        glareAngleStart: this.bubbleStartRadianAngle,
        glareAngleEnd: this.bubbleEndRadianAngle
      },
      {
        radius: 60.0,
        position: [this.centerCoords.x + 100, 300],
        positionAmplitude: 40,
        glareOffset: this.bubbleGlareOffset,
        glareAngleStart: this.bubbleStartRadianAngle,
        glareAngleEnd: this.bubbleEndRadianAngle
      },
      {
        radius: 40.0,
        position: [this.centerCoords.x - 200, 150],
        positionAmplitude: 30,
        glareOffset: this.bubbleGlareOffset,
        glareAngleStart: this.bubbleStartRadianAngle,
        glareAngleEnd: this.bubbleEndRadianAngle
      },
    ];


    this.render = this.render.bind(this);
  }

  addBubble(index) {
    const {width} = this.renderer.getSize();
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
    this.canvasElement = document.getElementById(this.canvasSelector);
    this.canvasElement.width = this.ww;
    this.canvasElement.height = this.wh;

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvasElement});
    this.renderer.setClearColor(this.backgroundColor, 1);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.ww, this.wh);

    this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
    this.camera.position.z = this.position.z;

    this.scene = new THREE.Scene();

    const loadManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadManager);
    const loadedTextures = this.textures.map((texture) => ({src: textureLoader.load(texture.src), options: texture.options}));
    const geometry = new THREE.PlaneGeometry(1, 1);

    loadManager.onLoad = () => {
      loadedTextures.forEach((loadedTexture, index) => {
        const material = new THREE.RawShaderMaterial(prepareStoryRawShaderMaterial({
          map: {value: loadedTexture.src},
          options: {value: loadedTexture.options},
          ...this.addBubble(index),
        }));

        const image = new THREE.Mesh(geometry, material);
        image.scale.x = this.wh * this.textureRatio;
        image.scale.y = this.wh;
        image.position.x = this.getScenePosition(index);
        this.scene.add(image);
      });
      this.render();
    };
  }

  changeStory(index) {
    this.camera.position.x = this.getScenePosition(index);
    this.render();
  }

  getScenePosition(index) {
    return this.wh * this.textureRatio * index;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
