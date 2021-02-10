import * as THREE from 'three';

import {getMaterial} from '../common';
import {snowmanConfig} from './config';

class Snowman extends THREE.Group {
  constructor() {
    super();

    this.config = snowmanConfig;

    this.constructChildren = this.constructChildren.bind(this);

    this.constructChildren();
  }

  constructChildren() {
    this.addBase();
    this.addTop();
  }

  addBase() {
    const sphere = new THREE.SphereBufferGeometry(
        this.config.baseSphere.radius,
        this.config.baseSphere.segments,
        this.config.baseSphere.segments
    );
    const sphereMesh = new THREE.Mesh(sphere, getMaterial({
      color: this.config.baseSphere.color,
      ...this.config.baseSphere.reflectivitySettings
    }));

    this.add(sphereMesh);
  }

  addTop() {
    this.top = new THREE.Group();

    const sphere = new THREE.SphereBufferGeometry(
        this.config.topSphere.radius,
        this.config.topSphere.segments,
        this.config.topSphere.segments
    );
    const sphereMesh = new THREE.Mesh(sphere, getMaterial({
      color: this.config.topSphere.color,
      ...this.config.topSphere.reflectivitySettings
    }));

    const cone = new THREE.ConeBufferGeometry(
        this.config.cone.radius,
        this.config.cone.height,
        this.config.cone.radialSegments
    );
    const coneMesh = new THREE.Mesh(cone, getMaterial({
      color: this.config.cone.color,
      ...this.config.cone.reflectivitySettings
    }));

    this.top.add(sphereMesh);
    this.top.add(coneMesh);

    sphereMesh.position.set(0, 105, 0);

    coneMesh.rotation.x = 90 * THREE.Math.DEG2RAD;
    coneMesh.position.set(0, 105, 43);

    this.add(this.top);
  }
}

export default Snowman;
