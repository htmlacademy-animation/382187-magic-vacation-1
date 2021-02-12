import * as THREE from 'three';
import {SVGLoader} from 'three/examples/jsm/loaders/SVGLoader.js';
import {colors, reflectivitySettings} from './common';
import SVGObject from './svg-object';

const svgLoader = new SVGLoader();

const toExtrudeSvgs = [
  {
    name: `flamingo`,
    src: `./img/flamingo.svg`,
    height: 85,
    depth: 8,
    cap: 2,
    color: colors.LightDominantRed,
    materialReflectivity: reflectivitySettings.soft
  },
  {
    name: `snowflake`,
    src: `./img/snowflake.svg`,
    height: 74,
    depth: 8,
    cap: 2,
    color: colors.Blue,
    materialReflectivity: reflectivitySettings.basic
  },
  {
    name: `question`,
    src: `./img/question.svg`,
    height: 56,
    depth: 8,
    cap: 2,
    color: colors.Blue,
    materialReflectivity: reflectivitySettings.basic
  },
  {
    name: `leaf-1`,
    src: `./img/leaf.svg`,
    height: 117,
    depth: 8,
    cap: 2,
    color: colors.Green,
    materialReflectivity: reflectivitySettings.basic
  },
  {
    name: `keyhole`,
    src: `./img/keyhole.svg`,
    height: 2000,
    depth: 20,
    cap: 2,
    color: colors.DarkPurple,
    materialReflectivity: reflectivitySettings.soft,
    children: new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.Purple),
      side: THREE.DoubleSide,
      ...reflectivitySettings.basic,
    })),
  },
  {
    name: `flower`,
    src: `./img/flower.svg`,
    height: 413,
    depth: 4,
    cap: 2,
    color: colors.DarkPurple,
    materialReflectivity: {}
  },
  {
    name: `leaf-2`,
    src: `./img/leaf.svg`,
    height: 335.108,
    depth: 3,
    cap: 3,
    color: colors.Green,
    materialReflectivity: reflectivitySettings.basic
  },
];

export const createSvgGroup = (data, config) => {
  const paths = data.paths;
  const group = new THREE.Group();

  group.scale.y *= -1;

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.color),
      side: THREE.DoubleSide,
      ...config.materialReflectivity,
    });

    const shapes = path.toShapes(false);

    for (let j = 0; j < shapes.length; j++) {

      const shape = shapes[j];
      const geometry = new THREE.ExtrudeBufferGeometry(shape, {
        steps: 2,
        depth: config.depth,
        bevelEnabled: true,
        bevelThickness: config.cap,
        bevelSize: config.cap,
        bevelOffset: 0,
        bevelSegments: 1,
      });
      geometry.applyMatrix4(new THREE.Matrix4().makeScale(1, 1, 1));
      const mesh = new THREE.Mesh(geometry, material);

      if (config.children) {
        const content = config.children;

        const size = new THREE.Vector3();
        new THREE.Box3().setFromObject(content).getSize(size);
        content.position.set(size.x / 2, -size.y / 2, 1);

        group.add(content);
      }

      group.add(mesh);
    }
  }

  group.name = config.name;

  return group;
};

export const promisifiedLoader = (loader, url) => {
  return new Promise((resolve, reject) => {
    loader.load(url, (data) => resolve(data), null, reject);
  });
};

export const loadedSvgs = (svgs) => svgs.reduce(async (resultPromise, path) => {
  const data = await promisifiedLoader(svgLoader, path.src);
  const svgGroup = createSvgGroup(data, path);

  const result = await resultPromise;
  result.add(svgGroup);
  return result;
}, new THREE.Group());

let svgObject;
export const getSvgObject = async () => {
  if (!svgObject) {
    const svgs = await loadedSvgs(toExtrudeSvgs);
    svgObject = new SVGObject(svgs);
  }
  return svgObject;
};
