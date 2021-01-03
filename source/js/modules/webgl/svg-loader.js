import * as THREE from 'three';
import {SVGLoader} from 'three/examples/jsm/loaders/SVGLoader.js';
import SVGObject from './svg-object';

const svgLoader = new SVGLoader();

const toExtrudeSvgs = [
  {
    name: `flamingo`,
    src: `./img/flamingo.svg`,
    height: 85,
    depth: 8,
    cap: 2,
    color: `#fe6183`,
  },
  {
    name: `snowflake`,
    src: `./img/snowflake.svg`,
    height: 74,
    depth: 8,
    cap: 2,
    color: `#3b7bf2`,
  },
  {
    name: `question`,
    src: `./img/question.svg`,
    height: 56,
    depth: 8,
    cap: 2,
    color: `#3b7bf2`,
  },
  {
    name: `leaf-1`,
    src: `./img/leaf.svg`,
    height: 117,
    depth: 8,
    cap: 2,
    color: `#34df96`,
  },
  {
    name: `keyhole`,
    src: `./img/keyhole.svg`,
    height: 2000,
    depth: 20,
    cap: 2,
    color: `#a67ee5`,
  },
  {
    name: `flower`,
    src: `./img/flower.svg`,
    height: 413,
    depth: 4,
    cap: 2,
    color: `#664ba5`,
  },
  {
    name: `leaf-2`,
    src: `./img/leaf.svg`,
    height: 335.108,
    depth: 3,
    cap: 3,
    color: `#34df96`,
  },
];

export const createSvgGroup = (data, config) => {
  const paths = data.paths;
  const group = new THREE.Group();

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];

    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(config.color),
    });

    const shapes = path.toShapes(true);

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
      const mesh = new THREE.Mesh(geometry, material);
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
