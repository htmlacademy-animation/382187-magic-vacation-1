import * as THREE from 'three';

export default class Story {
  constructor() {
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;

    this.canvasSelector = `story-canvas`;
    this.texturePaths = [
      `./img/scene-1.png`,
      `./img/scene-2.png`,
      `./img/scene-3.png`,
      `./img/scene-4.png`,
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
    const loadedTextures = this.texturePaths.map((texturePath) => textureLoader.load(texturePath));
    const geometry = new THREE.PlaneGeometry(1, 1);

    loadManager.onLoad = () => {
      loadedTextures.forEach((loadedTexture, index) => {
        const material = new THREE.MeshBasicMaterial({map: loadedTexture});
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