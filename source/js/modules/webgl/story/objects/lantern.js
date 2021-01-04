import * as THREE from 'three';

import {getSquareRadius} from '../../../helpers';
import {getMaterial} from '../../common';
import {lanternConfig} from './config';

class Lantern extends THREE.Group {
  constructor() {
    super();

    this.config = lanternConfig;

    this.topCap = lanternConfig.topCap;
    this.topTrapezoid = lanternConfig.topTrapezoid;
    this.topBox = lanternConfig.topBox;
    this.middleCylinder = lanternConfig.middleCylinder;
    this.baseSphere = lanternConfig.baseSphere;
    this.baseCylinder = lanternConfig.baseCylinder;

    this.addBase = this.addBase.bind(this);
    this.addMiddle = this.addMiddle.bind(this);
    this.addTop = this.addTop.bind(this);
    this.constructChildren = this.constructChildren.bind(this);

    this.constructChildren();
  }

  constructChildren() {
    this.addBase();
    this.addMiddle();
    this.addTop();
  }

  addBase() {
    this.base = new THREE.Group();

    const {baseCylinder, baseSphere} = this.config;

    const cylinder = new THREE.CylinderBufferGeometry(
        baseCylinder.radius,
        baseCylinder.radius,
        baseCylinder.height,
        baseCylinder.radialSegments
    );
    const cylinderMesh = new THREE.Mesh(cylinder, getMaterial({color: baseCylinder.color}));

    const halfSphere = new THREE.SphereBufferGeometry(baseSphere.radius,
        baseSphere.segments, baseSphere.segments,
        Math.PI * 2.00, Math.PI * 2.00,
        0, Math.PI * 0.5);
    const halfSphereMesh = new THREE.Mesh(halfSphere, getMaterial({color: baseSphere.color}));

    this.base.add(cylinderMesh);
    this.base.add(halfSphereMesh);
    halfSphereMesh.position.set(0, baseCylinder.height / 2, 0);

    this.add(this.base);
  }

  addMiddle() {
    const {middleCylinder, baseSphere} = this.config;

    const cylinder = new THREE.CylinderBufferGeometry(
        middleCylinder.radius,
        middleCylinder.radius,
        middleCylinder.height,
        middleCylinder.radialSegments
    );
    const cylinderMesh = new THREE.Mesh(cylinder, getMaterial({color: middleCylinder.color}));

    const size = new THREE.Vector2();
    const currentGroupSize = new THREE.Box3().setFromObject(this).getSize(size);

    this.add(cylinderMesh);
    cylinderMesh.position.set(0, currentGroupSize.y / 2 + baseSphere.radius / 2 + middleCylinder.height / 2, 0);
  }

  addTop() {
    this.top = new THREE.Group();

    const {topBox, topTrapezoid, topCap} = this.config;

    const box = new THREE.BoxBufferGeometry(
        topBox.width,
        topBox.height,
        topBox.width
    );
    const boxMesh = new THREE.Mesh(box, getMaterial({color: topBox.color, flatShading: true}));

    const trapezoid = new THREE.CylinderBufferGeometry(
        getSquareRadius(topTrapezoid.widthTop),
        getSquareRadius(topTrapezoid.widthBottom),
        topTrapezoid.height,
        topTrapezoid.radialSegments
    );
    const trapezoidMesh = new THREE.Mesh(
        trapezoid,
        getMaterial({color: topTrapezoid.color, flatShading: true})
    );

    const cap = new THREE.CylinderBufferGeometry(
        getSquareRadius(topCap.widthTop),
        getSquareRadius(topCap.widthBottom),
        topCap.height,
        topCap.radialSegments
    );
    const capMesh = new THREE.Mesh(cap, getMaterial({color: topCap.color, flatShading: true}));

    this.top.add(boxMesh);
    boxMesh.rotation.y = -45 * THREE.Math.DEG2RAD;
    this.top.add(trapezoidMesh);
    this.top.add(capMesh);

    trapezoidMesh.position.set(0, topBox.height / 2 + topTrapezoid.height / 2, 0);
    capMesh.position.set(0, topBox.height / 2 + topTrapezoid.height + topCap.height / 2, 0);
    const currentGroupSize = new THREE.Box3().setFromObject(this).getSize(new THREE.Vector3());
    this.add(this.top);
    const currentElementSize = new THREE.Box3().setFromObject(this.top).getSize(new THREE.Vector3());

    this.top.position.set(0, currentGroupSize.y / 2 + 50 + currentElementSize.y, 0);
  }
}

export default Lantern;
