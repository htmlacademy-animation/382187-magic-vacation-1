import * as THREE from 'three';

import {getLathePointsForCircle, getMaterial} from '../../common';
import {saturnConfig} from './config';

class Saturn extends THREE.Group {
  constructor() {
    super();

    this.saturn = saturnConfig;

    this.constructChildren = this.constructChildren.bind(this);

    this.constructChildren();
  }

  constructChildren() {
    this.addPlanet();
    this.addRing();
    this.addSphere();
    this.addLine();
  }

  addPlanet() {
    const planet = new THREE.SphereBufferGeometry(
        this.saturn.planet.radius,
        this.saturn.planet.segments,
        this.saturn.planet.segments
    );
    const mesh = new THREE.Mesh(planet, getMaterial({color: this.saturn.planet.color}));

    this.add(mesh);
  }

  addRing() {
    const points = getLathePointsForCircle(
        this.saturn.ring.width,
        this.saturn.ring.depth,
        this.saturn.ring.radius
    );

    const ring = new THREE.LatheBufferGeometry(points, this.saturn.ring.segments);
    const mesh = new THREE.Mesh(ring, getMaterial({
      color: this.saturn.ring.color,
      side: THREE.DoubleSide,
      flatShading: true,
    }));
    mesh.rotation.copy(new THREE.Euler(20 * THREE.Math.DEG2RAD, 0, 18 * THREE.Math.DEG2RAD), `XYZ`);

    this.add(mesh);
  }

  addSphere() {
    const sphere = new THREE.SphereBufferGeometry(
        this.saturn.sphere.radius,
        this.saturn.sphere.segments,
        this.saturn.sphere.segments
    );
    const mesh = new THREE.Mesh(sphere, getMaterial({color: this.saturn.sphere.color}));

    mesh.position.set(0, this.saturn.ring.radius + this.saturn.sphere.radius + 30, 0);
    this.add(mesh);
  }

  addLine() {
    const line = new THREE.CylinderBufferGeometry(
        this.saturn.line.radius,
        this.saturn.line.radius,
        this.saturn.line.height,
        this.saturn.line.radialSegments
    );
    const mesh = new THREE.Mesh(line, getMaterial({color: this.saturn.line.color}));

    mesh.position.set(0, this.saturn.line.height / 2, 0);
    this.add(mesh);
  }
}

export default Saturn;
