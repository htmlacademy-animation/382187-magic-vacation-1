import * as THREE from 'three';
import prepareRawShaderMaterial from '../shaders/start';
import {svgsConfig} from './config';
import {setMeshParams} from '../common';
import {getSvgObject} from '../svg-loader';

class Start {
  constructor() {
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;

    this.canvasSelector = `start-canvas`;

    this.svgs = svgsConfig;
    this.sceneParams = {
      fov: 45,
      aspect: this.ww / this.wh,
      near: 0.1,
      far: 1000,
      texturePath: `./img/scene-0.png`,
      textureRatio: 2048 / 1024,
      backgroundColor: 0x5f458c,
      position: {
        z: 800
      }
    };

    this.isInitialised = false;

    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);
  }

  resize() {
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;

    this.canvasElement.width = this.ww;
    this.canvasElement.height = this.wh;

    this.camera.aspect = this.ww / this.wh;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.ww, this.wh);
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

    this.camera = new THREE.PerspectiveCamera(
        this.sceneParams.fov,
        this.sceneParams.aspect,
        this.sceneParams.near,
        this.sceneParams.far
    );
    this.camera.position.z = this.sceneParams.position.z;

    this.scene = new THREE.Scene();

    const loadManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadManager);
    const loadedTexture = textureLoader.load(this.sceneParams.texturePath);
    const material = new THREE.RawShaderMaterial(prepareRawShaderMaterial({map: {value: loadedTexture}}));
    const geometry = new THREE.PlaneGeometry(1, 1);

    loadManager.onLoad = () => {
      const image = new THREE.Mesh(geometry, material);
      image.scale.x = this.wh * this.sceneParams.textureRatio;
      image.scale.y = this.wh;

      this.scene.add(image);
      this.render();
    };

    this.loadSvgs();
  }

  async loadSvgs() {
    const svgObject = await getSvgObject();
    this.svgs.forEach((params) => {
      const mesh = svgObject.getObject(params.name);
      setMeshParams(mesh, params);
      this.scene.add(mesh);
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

const start = () => {
  const startScene = new Start();

  document.body.addEventListener(`screenChanged`, (event) => {
    const {detail: {screenName}} = event;

    if (screenName === `top`) {
      startScene.start();
    }
  });
};

export default () => {
  start();
};
