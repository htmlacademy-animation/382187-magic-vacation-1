import * as THREE from 'three';
import {getSquareRadius} from '../../helpers';

class Lantern extends THREE.Group {
  constructor() {
    super();

    this.topCap = {
      widthTop: 45,
      widthBottom: 57,
      height: 6,
      color: `#376ee0`,
      radialSegments: 4,
    };

    this.topTrapezoid = {
      widthTop: 42,
      widthBottom: 34,
      height: 60,
      color: `#9db3ef`,
      radialSegments: 4,
    };

    this.topBox = {
      width: 37,
      height: 4,
      color: `#376ee0`,
    };

    this.middleCylinder = {
      height: 230,
      radius: 7,
      radialSegments: 20,
      color: `#376ee0`,
    };

    this.baseSphere = {
      height: 16,
      radius: 16,
      segments: 20,
      color: `#376ee0`,
    };

    this.baseCylinder = {
      height: 120,
      radius: 16,
      radialSegments: 20,
      color: `#376ee0`,
    };

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

  getMaterial(options = {}) {
    const {color, ...other} = options;

    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      ...other,
    });
  }

  addBase() {
    this.base = new THREE.Group();

    const cylinder = new THREE.CylinderBufferGeometry(this.baseCylinder.radius, this.baseCylinder.radius, this.baseCylinder.height, this.baseCylinder.radialSegments);
    const cylinderMesh = new THREE.Mesh(cylinder, this.getMaterial({color: this.baseCylinder.color}));

    const halfSphere = new THREE.SphereBufferGeometry(this.baseSphere.radius,
        this.baseSphere.segments, this.baseSphere.segments,
        Math.PI * 2.00, Math.PI * 2.00,
        0, Math.PI * 0.5);
    const halfSphereMesh = new THREE.Mesh(halfSphere, this.getMaterial({color: this.baseSphere.color}));

    this.base.add(cylinderMesh);
    this.base.add(halfSphereMesh);
    halfSphereMesh.position.set(0, this.baseCylinder.height / 2, 0);

    this.add(this.base);
  }

  addMiddle() {
    const cylinder = new THREE.CylinderBufferGeometry(this.middleCylinder.radius, this.middleCylinder.radius, this.middleCylinder.height, this.middleCylinder.radialSegments);
    const cylinderMesh = new THREE.Mesh(cylinder, this.getMaterial({color: this.middleCylinder.color}));

    const size = new THREE.Vector2();
    const currentGroupSize = new THREE.Box3().setFromObject(this).getSize(size);

    this.add(cylinderMesh);
    cylinderMesh.position.set(0, currentGroupSize.y / 2 + this.baseSphere.radius / 2 + this.middleCylinder.height / 2, 0);
  }

  addTop() {
    this.top = new THREE.Group();

    const box = new THREE.BoxBufferGeometry(this.topBox.width, this.topBox.height, this.topBox.width);
    const boxMesh = new THREE.Mesh(box, this.getMaterial({color: this.topBox.color, flatShading: true}));

    const trapezoid = new THREE.CylinderBufferGeometry(getSquareRadius(this.topTrapezoid.widthTop), getSquareRadius(this.topTrapezoid.widthBottom), this.topTrapezoid.height, this.topTrapezoid.radialSegments);
    const trapezoidMesh = new THREE.Mesh(trapezoid, this.getMaterial({color: this.topTrapezoid.color, flatShading: true}));

    const cap = new THREE.CylinderBufferGeometry(getSquareRadius(this.topCap.widthTop), getSquareRadius(this.topCap.widthBottom), this.topCap.height, this.topCap.radialSegments);
    const capMesh = new THREE.Mesh(cap, this.getMaterial({color: this.topCap.color, flatShading: true}));

    this.top.add(boxMesh);
    boxMesh.rotation.y = -45 * THREE.Math.DEG2RAD;
    this.top.add(trapezoidMesh);
    this.top.add(capMesh);

    trapezoidMesh.position.set(0, this.topBox.height / 2 + this.topTrapezoid.height / 2, 0);
    capMesh.position.set(0, this.topBox.height / 2 + this.topTrapezoid.height + this.topCap.height / 2, 0);
    const currentGroupSize = new THREE.Box3().setFromObject(this).getSize();
    this.add(this.top);
    const currentElementSize = new THREE.Box3().setFromObject(this.top).getSize();

    this.top.position.set(0, currentGroupSize.y / 2 + 50 + currentElementSize.y, 0);
  }
}

export default Lantern;
