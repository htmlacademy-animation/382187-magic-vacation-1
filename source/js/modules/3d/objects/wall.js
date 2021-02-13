import * as THREE from 'three';

import {getLatheDegrees, setMeshParams, getMaterial} from '../common';
import {loadModel} from '../load-object-model';
import {getWallConfig} from './config';


class Wall extends THREE.Group {
  constructor({wallMaterialReflectivity, wallColor, floorColor} = {}) {
    super();

    this.config = getWallConfig(wallMaterialReflectivity, wallColor, floorColor);

    this.wall = this.config.wall;
    this.floor = this.config.floor;

    this.constructChildren = this.constructChildren.bind(this);
    this.constructChildren();
  }

  constructChildren() {
    this.addFloor();
    this.addWall();
  }

  addWall() {
    const material = getMaterial({color: this.wall.color, ...this.wall.materialReflectivity});

    loadModel(this.wall, material, (mesh) => {
      mesh.name = this.wall.name;
      setMeshParams(mesh, this.wall);
      this.add(mesh);
    });
  }

  addFloor() {
    const {start, length} = getLatheDegrees(this.floor.start, this.floor.end);
    const geometry = new THREE.CircleGeometry(this.floor.radius, this.floor.segments, start, length);
    const mesh = new THREE.Mesh(geometry, getMaterial({
      color: this.floor.color,
      ...this.floor.materialReflectivity,
    }));
    setMeshParams(mesh, this.floor);
    this.add(mesh);
  }
}

export default Wall;
