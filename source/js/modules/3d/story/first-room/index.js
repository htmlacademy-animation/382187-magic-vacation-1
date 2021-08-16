import * as THREE from 'three';

import getSvgObject from '../../common/svg-object';
import colors from '../../common/colors';
import materialReflectivity from '../../common/material-reflectivity';
import {loadModel} from '../../common/load-model';
import {setMeshParams, getMaterial} from '../../common/helpers';
import isMobile from '../../../../helpers/is-mobile';
import Carpet from '../../common/objects/carpet';
import {Saturn, getSaturn} from '../../common/objects/saturn';
import Wall from '../../common/objects/wall';
import getDog from '../../common/objects/dog';
import getSonya from '../../common/objects/sonya';

class FirstRoom extends THREE.Group {
  constructor({dark} = {}) {
    super();

    this.dark = dark;

    this.models = [
      {
        name: `static`,
        type: `gltf`,
        path: `3d/gltf/scene${this.dark ? 4 : 1}-static-output-1.gltf`,
        scale: 0.3,
        position: {x: 0, y: 0, z: 1},
        rotate: {x: 0, y: -45, z: 0},
        ...!isMobile && {
          receiveShadow: true,
          castShadow: true,
        }
      },
    ];

    this.startAnimation = this.startAnimation.bind(this);
    this.constructChildren = this.constructChildren.bind(this);
    this.constructChildren();
  }

  constructChildren() {
    this.addWall();
    this.loadModels();
    this.addFlower();
    this.addCarpet();
    this.addSaturn();

    if (this.dark) {
      this.addSonya();
    } else {
      this.addDog();
    }
  }

  addFlower() {
    getSvgObject({name: this.dark ? `flower-dark` : `flower`}, (flower) => {
      setMeshParams(flower, {
        position: {x: -90, y: 130, z: 100},
        rotate: {x: 0, y: 45, z: 0},
        scale: 0.3,
        ...!isMobile && {
          receiveShadow: true,
          castShadow: true,
        }
      });
      this.add(flower);
    });
  }

  addCarpet() {
    const carpet = new Carpet({isDark: this.dark});
    setMeshParams(carpet, {
      scale: 0.3,
      position: {x: 0, y: 0, z: 0},
      rotate: {x: 0, y: 45, z: 180},
      ...!isMobile && {
        receiveShadow: true,
      }
    });
    this.add(carpet);
  }

  addSaturn() {
    if (this.dark) {
      const saturn = new Saturn({dark: this.dark});
      setMeshParams(saturn, {
        scale: 0.3,
        position: {x: 30, y: 150, z: 100},
        ...!isMobile && {
          receiveShadow: true,
          castShadow: true,
        }
      });

      this.add(saturn);
    } else {
      getSaturn((mesh, animateSaturn) => {
        this.add(mesh);

        this.animateSaturn = (callback) => animateSaturn(mesh, callback);
      });
    }
  }

  addWall() {
    const wall = new Wall({
      wallMaterialReflectivity: materialReflectivity[this.dark ? `basic` : `soft`],
      wallColor: colors[this.dark ? `ShadowedPurple` : `Purple`],
      floorColor: colors[this.dark ? `ShadowedDarkPurple` : `DarkPurple`],
    });
    this.add(wall);
  }

  addDog() {
    getDog((mesh, animateDog) => {
      this.add(mesh);

      if (!this.dogAnimated) {
        animateDog(mesh);
        this.dogAnimated = true;
      }
    });
  }

  loadModels() {
    this.models.forEach((params) => {
      const material = params.color && getMaterial({color: params.color, ...params.materialReflectivity});

      loadModel(params, material, (mesh) => {
        mesh.name = params.name;
        setMeshParams(mesh, params);
        this.add(mesh);
      });
    });
  }

  addSonya() {
    getSonya((mesh, animateSonya) => {
      this.add(mesh);

      this.animateSonya = (callback) => animateSonya(mesh, callback);
    });
  }

  startAnimation(callback) {
    if (!this.saturnAnimated && this.animateSaturn) {
      this.animateSaturn(callback);
      this.saturnAnimated = true;
    }

    if (!this.sonyaAnimated && this.animateSonya) {
      this.animateSonya(callback);
      this.sonyaAnimated = true;
    }
  }
}

export default FirstRoom;
