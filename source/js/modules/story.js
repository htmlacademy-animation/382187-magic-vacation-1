import * as THREE from 'three';
import {prepareRawShaderMaterial} from './helpers';

export default class Story {
  constructor() {
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;

    this.canvasSelector = `story-canvas`;
    this.textures = [
      {src: `./img/scene-1.png`, hueShift: 0.0},
      {src: `./img/scene-2.png`, hueShift: -0.25},
      {src: `./img/scene-3.png`, hueShift: 0.0},
      {src: `./img/scene-4.png`, hueShift: 0.0}
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

    this.render = this.render.bind(this);
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
    const loadedTextures = this.textures.map((texture) => ({src: textureLoader.load(texture.src), hueShift: texture.hueShift}));
    const geometry = new THREE.PlaneGeometry(1, 1);

    loadManager.onLoad = () => {
      loadedTextures.forEach((loadedTexture, index) => {
        const material = new THREE.RawShaderMaterial(prepareRawShaderMaterial({
          map: {value: loadedTexture.src},
          hueShift: {value: loadedTexture.hueShift}
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
