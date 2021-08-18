import * as THREE from 'three';

import loadManager from '../common/load-manager';
import isMobile from '../../../helpers/is-mobile';
import CameraRig from '../common/camera-rig';
import {getLightConfig, createLight} from '../common/lights';
import {setMeshParams} from '../common/helpers';
import {hideObjectsOnMobile} from '../common/hide-objects';
import setBEMModificators from '../common/classes';
import rooms from '../common/room-settings';
import getSuitcase from '../common/objects/suitcase';
import getCameraSettings from '../common/camera-settings';

const ScreenName = {
  top: `intro`,
  story: `room`,
  intro: `intro`,
  room: `room`,
};

const ScreenId = {
  intro: 0,
  room: 1,
};

const box = new THREE.Box3();

export default class Story {
  constructor() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.isPortrait = window.innerHeight > window.innerWidth;
    this.canvasCenter = {x: this.innerWidth / 2, y: this.innerHeight / 2};

    this.canvasSelector = `start-canvas`;

    this.roomAnimations = {};
    this.roomAnimationsCount = 0;

    this.backgroundColor = 0x5f458c;

    this.initialized = false;
    this.animationRequest = null;

    this.aspect = this.innerWidth / this.innerHeight;
    this.near = 0.1;
    this.far = 1605;
    this.position = {
      z: 1605,
    };

    this.cameraSettings = getCameraSettings(this.position.z, this.isPortrait);

    const lights = getLightConfig(this.position.z);
    this.screenLights = {
      [ScreenName.intro]: () => createLight(lights.intro, ScreenName.intro),
      [ScreenName.room]: () => createLight(lights.room, ScreenName.room),
    };

    this.currentScene = 0;

    this.sceneSize = new THREE.Vector2();
    this.progressBar = document.querySelector(`.progress-bar`);
    this.progressBar.style.zIndex = 2;

    this.render = this.render.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.updateScreenSize = this.updateScreenSize.bind(this);
  }

  get fov() {
    if (this.innerWidth > this.innerHeight) {
      return 34;
    }

    return (32 * this.innerHeight) / Math.min(this.innerWidth * 1.3, this.innerHeight);
  }

  getScenePosition(index) {
    return this.innerWidth * index;
  }

  setLight() {
    if (isMobile) {
      return;
    }

    const [current, previous] = this.currentScene === 0 ? [ScreenName.intro, ScreenName.room] : [ScreenName.room, ScreenName.intro];

    const currentLight = this.scene.getObjectByName(`light-${current}`);
    const previousLight = this.scene.getObjectByName(`light-${previous}`);

    if (currentLight) {
      currentLight.visible = true;
    } else {
      const light = this.screenLights[current]();
      this.scene.add(light);
    }

    if (previousLight) {
      previousLight.visible = false;
    }
  }

  setRigAnimation() {
    let startTime = -1;
    let time = -1;
    this.updateRig = () => {
      const nowT = Date.now();

      if (startTime < 0) {
        startTime = time = nowT;

        return;
      }

      const t = (nowT - startTime) * 0.001;
      const dt = (nowT - time) * 0.001;

      this.rig.update(dt, t);

      time = nowT;
    };
  }

  setRigPosition(index) {
    this.rigUpdating = true;
    if (this.currentScene === 0) {
      const isBack = this.previousScene > 1;

      const rigRotation = {
        ...this.cameraSettings.intro.rigRotation,
        y: isBack ? this.rig.rigRotation.y : this.cameraSettings.intro.rigRotation.y
      };
      const settings = {
        ...this.cameraSettings.intro,
        rigRotation,
      };

      this.rig.changeStateTo(settings, () => {
        if (isBack) {
          setMeshParams(this.introPivot, {rotate: {x: 0, y: 0, z: 0}});
          this.rig.rigRotation = this.cameraSettings.intro.rigRotation;
        }

        this.rigUpdating = false;
      });
    } else {
      const roomIndex = index - 1;
      const rotate = roomIndex * 90;

      const rigRotation = {...this.cameraSettings.room.rigRotation, y: rotate};
      const rigTilt = {
        ...this.cameraSettings.room.rigTilt,
        ...roomIndex === 0 && {x: 0}
      };

      const settings = {
        ...this.cameraSettings.room,
        rigRotation,
        rigTilt,
      };

      this.intro.fadeOutAnimation();
      this.rig.changeStateTo(settings, () => {
        this.intro.resetFadeOutAnimation();
        this.rigUpdating = false;
      });

      if (this.rotateSuitcase) {
        this.rotateSuitcase({x: 0, y: rotate, z: 0});
      }

      const light = this.scene.getObjectByName(`light-room`);
      if (light) {
        setMeshParams(light, {rotate: {x: 0, y: rotate, z: 0}});
      }
      if (this.introPivot) {
        setMeshParams(this.introPivot, {rotate: {x: 0, y: rotate, z: 0}});
      }
    }
  }

  prepareScene(screenName) {
    this.canvasElement = document.getElementById(this.canvasSelector);
    this.canvasElement.width = this.innerWidth;
    this.canvasElement.height = this.innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasElement,
      powerPreference: `high-performance`
    });
    this.renderer.setClearColor(this.backgroundColor, 1);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.innerWidth, this.innerHeight);
    if (!isMobile) {
      this.renderer.shadowMap.enabled = true;
    }

    this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);

    this.scene = new THREE.Scene();

    this.rig = new CameraRig(this.cameraSettings[screenName]);
    this.rig.addObjectToCameraNull(this.camera);
    this.scene.add(this.rig);
    this.setRigPosition();
    this.setRigAnimation();

    const [intro, ...slider] = rooms;

    const {Elements: IntroRoom} = intro;
    this.intro = new IntroRoom(this.isPortrait);

    this.roomGroup = new THREE.Group();
    slider.forEach((room, index) => {
      const Elements = room.Elements;
      const elements = new Elements(room.elementsOptions);
      elements.rotation.y = index * 90 * THREE.Math.DEG2RAD;
      this.roomGroup.add(elements);
      this.roomAnimations = {
        ...this.roomAnimations,
        [index + 1]: elements.startAnimation,
      };
    });

    box.setFromObject(this.roomGroup);
    box.center(this.roomGroup.position); // this re-sets the mesh position
    this.roomGroup.position.multiplyScalar(-1);

    box.setFromObject(this.intro);
    box.center(this.intro.position); // this re-sets the mesh position
    this.intro.position.multiplyScalar(-1);

    this.roomPivot = new THREE.Group();
    this.scene.add(this.roomPivot);
    this.roomPivot.add(this.roomGroup);
    setMeshParams(this.roomPivot, {position: {x: 0, y: 130, z: 0}, scale: this.isPortrait ? 0.8 : 1});

    this.introPivot = new THREE.Group();
    this.scene.add(this.introPivot);
    this.introPivot.add(this.intro);
    this.intro.position.z = 600;

    this.introAnimationRequest = true;

    getSuitcase((suitcase, animateSuitcase, rotateSuitcase) => {
      const rotationGroup = new THREE.Group();
      this.roomGroup.add(rotationGroup);
      rotationGroup.add(suitcase);
      rotationGroup.position.y = 0;

      this.animateSuitcase = (callback) => animateSuitcase(suitcase, callback);
      this.rotateSuitcase = (rotation) => rotateSuitcase(rotation, rotationGroup);
      if (this.currentScene === 1 && !this.suitcaseAnimated) {
        this.roomAnimationsCount += 1;
        this.render();
        this.animateSuitcase(() => {
          this.roomAnimationsCount -= 1;
        });
        this.suitcaseAnimated = true;
      }
    });

    this.setLight();
    hideObjectsOnMobile(this.scene);
  }

  init(rawName) {
    const screenName = ScreenName[rawName];

    if (!this.initialized) {
      this.prepareScene(screenName);
      this.initialized = true;

      this.intro.visible = false;
      this.roomGroup.visible = false;

      loadManager.onProgress = (_, itemsLoaded, itemsTotal) => {
        this.progressBar.textContent = `${Math.round(itemsLoaded / itemsTotal * 100)} %`;
      };

      loadManager.onLoad = () => {
        this.intro.visible = true;
        this.roomGroup.visible = true;
        this.progressBar.style.zIndex = -1;
        this.renderer.render(this.scene, this.camera);
        this.intro.startAnimation();
        this.intro.onAnimationEnd = () => {
          this.introAnimationRequest = false;
        };
      };
    }

    window.addEventListener(`mousemove`, this.handleMouseMove);
    window.addEventListener(`resize`, this.handleResize);

    if (!this.animationRequest) {
      this.animationRequest = requestAnimationFrame(this.render);
    }

    this.changeScene(ScreenId[screenName]);
  }

  end() {
    window.removeEventListener(`resize`, this.handleResize);
    window.removeEventListener(`mousemove`, this.handleMouseMove);

    this.introAnimationRequest = null;
    this.roomAnimationsCount = 0;
    this.mouseMoving = false;
    this.rigUpdating = null;
    this.animationRequest = null;
    setBEMModificators(rooms[0].menuBackground);
  }

  handleResize() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    const isPortrait = window.innerHeight > window.innerWidth;

    if (isPortrait !== this.isPortrait) {
      this.isPortrait = isPortrait;
      this.cameraSettings = getCameraSettings(this.position.z, this.isPortrait);
      this.setRigPosition(this.currentScene);
      this.intro.portrait = this.isPortrait;
      setMeshParams(this.roomPivot, {scale: this.isPortrait ? 0.8 : 1});
    }

    this.updateScreenSize();
  }

  handleMouseMove(event) {
    this.mouseMoving = true;

    this.rig.handleMouseMove(event, () => {
      this.mouseMoving = false;
    });
  }

  updateScreenSize() {
    this.canvasElement.width = this.innerWidth;
    this.canvasElement.height = this.innerHeight;

    this.camera.fov = this.fov;
    this.camera.aspect = this.innerWidth / this.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.innerWidth, this.innerHeight);
  }

  changeScene(index) {
    if (index === this.currentScene) {
      return;
    }

    this.previousScene = this.currentScene;
    this.currentScene = index;
    this.setRigPosition(index);
    this.setLight();

    if (this.currentScene === 1 && this.animateSuitcase && !this.suitcaseAnimated) {
      this.animateSuitcase();
    }

    const roomAnimation = this.roomAnimations[this.currentScene];
    if (roomAnimation) {
      this.roomAnimationsCount += 1;

      this.render();
      roomAnimation(() => {
        this.roomAnimationsCount -= 1;
      });
    }

    setBEMModificators(rooms[this.currentScene].menuBackground);

    this.renderer.render(this.scene, this.camera);
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    if (this.introAnimationRequest || this.roomAnimationsCount > 0 || this.mouseMoving) {
      requestAnimationFrame(this.render);
    }

    if (this.rigUpdating) {
      this.updateRig();
    }
  }
}
