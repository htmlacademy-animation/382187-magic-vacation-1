import * as THREE from 'three';
import {SVGLoader} from 'three/examples/jsm/loaders/SVGLoader.js';
import {colors, reflectivitySettings} from './common';
import SVGObject from './svg-object';

const toExtrudeSvgs = [
  {
    name: `flamingo`,
    src: `img/flamingo.svg`,
    height: 85,
    depth: 8,
    cap: 2,
    color: colors.LightDominantRed,
    materialReflectivity: reflectivitySettings.soft
  },
  {
    name: `snowflake`,
    src: `img/snowflake.svg`,
    height: 74,
    depth: 8,
    cap: 2,
    color: colors.Blue,
    materialReflectivity: reflectivitySettings.basic
  },
  {
    name: `question`,
    src: `img/question.svg`,
    height: 56,
    depth: 8,
    cap: 2,
    color: colors.Blue,
    materialReflectivity: reflectivitySettings.basic
  },
  {
    name: `smallLeaf`,
    src: `img/leaf.svg`,
    height: 117,
    depth: 8,
    cap: 2,
    color: colors.Green,
    materialReflectivity: reflectivitySettings.basic
  },
  {
    name: `bigLeaf`,
    src: `img/leaf2.svg`,
    height: 335.108,
    depth: 2,
    cap: 2,
    color: colors.Green,
    materialReflectivity: reflectivitySettings.basic
  },
  {
    name: `bigLeaf`,
    src: `img/leaf2.svg`,
    height: 335.108,
    depth: 2,
    cap: 2,
    color: colors.Green,
    materialReflectivity: reflectivitySettings.basic
  },
  {
    name: `keyhole`,
    src: `img/keyhole.svg`,
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
    src: `img/flower.svg`,
    height: 413,
    depth: 4,
    cap: 2,
    color: colors.DarkPurple,
    materialReflectivity: {}
  },
  {
    name: `flower`,
    src: `img/flower.svg`,
    height: 413,
    depth: 4,
    cap: 2,
    color: colors.DarkPurple,
    materialReflectivity: {}
  },
];

const createSvgGroup = (data, settings) => {
  const paths = data.paths;
  const group = new THREE.Group();

  group.scale.y *= -1;

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(settings.color),
      side: THREE.DoubleSide,
      ...settings.materialReflectivity,
    });

    const shapes = path.toShapes(false);

    for (let j = 0; j < shapes.length; j++) {

      const shape = shapes[j];
      const geometry = new THREE.ExtrudeBufferGeometry(shape, {
        steps: 2,
        depth: settings.depth,
        bevelEnabled: true,
        bevelThickness: settings.cap,
        bevelSize: settings.cap,
        bevelOffset: 0,
        bevelSegments: 2,
      });
      geometry.applyMatrix4(new THREE.Matrix4().makeScale(1, 1, 1));
      const mesh = new THREE.Mesh(geometry, material);

      if (settings.children) {
        const content = settings.children;

        const size = new THREE.Vector3();
        new THREE.Box3().setFromObject(content).getSize(size);
        content.position.set(size.x / 2, -size.y / 2, 1);

        group.add(content);
      }

      group.add(mesh);
    }
  }

  group.name = settings.name;

  return group;
};

const loadedSvgs = new Promise((resolve) => {
  let loadCount = 0;

  const group = new THREE.Group();
  const loadManager = new THREE.LoadingManager();
  const loader = new SVGLoader(loadManager);

  toExtrudeSvgs.forEach((path) => {
    loader.load(path.src, (data) => {
      const svgGroup = createSvgGroup(data, path);
      group.add(svgGroup);
      loadCount++;
    });
  });

  loadManager.onLoad = () => {
    if (loadCount === toExtrudeSvgs.length) {
      resolve(group);
    }
  };
});

let svgObject;
export const getSvgObject = async () => {
  if (!svgObject) {
    const svgs = await loadedSvgs;
    svgObject = new SVGObject(svgs);
  }
  return svgObject;
};
