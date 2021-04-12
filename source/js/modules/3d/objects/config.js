import {getSquareRadius} from '../../helpers';
import {colors, reflectivitySettings} from '../common';

export const getWallConfig = (wallMaterialReflectivity, wallColor, floorColor, receiveShadow = true, castShadow = false) => ({
  wall: {
    name: `wall`,
    type: `obj`,
    path: `3d/obj/WallCornerUnit.obj`,
    materialReflectivity: wallMaterialReflectivity,
    color: wallColor,
    receiveShadow,
    castShadow,
    scale: 1,
    position: {x: 0, y: 0, z: 0},
    rotate: {x: 0, y: -45, z: 0},
  },
  floor: {
    radius: 1350,
    color: floorColor,
    materialReflectivity: reflectivitySettings.soft,
    segments: 8,
    start: 0,
    end: 90,
    scale: 1,
    receiveShadow,
    castShadow,
    position: {x: 0, y: 0, z: 0},
    rotate: {x: -90, y: -135, z: 0},
    rotationOrder: `YXZ`,
  }
});

export const carpetConfig = {
  width: 180,
  depth: 3,
  radius: 763,
  degStart: 16,
  degEnd: 74,
  color: `#A481D1`,
  segments: 40,
  stripes: 7,
};

export const roadConfig = {
  width: 160,
  depth: 3,
  radius: 732,
  degStart: 0,
  degEnd: 90,
  color: `#646B7C`,
  segments: 40,
};

export const getSaturnConfig = (isDarkTheme) => ({
  planet: {
    radius: 60,
    color: isDarkTheme ? colors.ShadowedDominantRed : colors.DominantRed,
    segments: 40,
    ...reflectivitySettings.soft
  },
  ring: {
    width: 40,
    depth: 2,
    radius: 80,
    color: isDarkTheme ? colors.ShadowedBrightPurple : colors.BrightPurple,
    segments: 40,
    ...reflectivitySettings.soft
  },
  sphere: {
    radius: 10,
    color: isDarkTheme ? colors.ShadowedBrightPurple : colors.BrightPurple,
    segments: 40,
    ...reflectivitySettings.soft
  },
  line: {
    radius: 1,
    height: 1000,
    color: colors.MetalGrey,
    segments: 40,
    ...reflectivitySettings.soft
  }
});

export const lanternConfig = {
  topCap: {
    widthTop: 45,
    widthBottom: 57,
    height: 6,
    color: `#376ee0`,
    radialSegments: 4,
    ...reflectivitySettings.soft
  },
  topTrapezoid: {
    widthTop: 42,
    widthBottom: 34,
    height: 60,
    color: `#9db3ef`,
    radialSegments: 4,
    ...reflectivitySettings.soft
  },
  topBox: {
    width: 37,
    height: 4,
    color: `#376ee0`,
    ...reflectivitySettings.soft
  },
  middleCylinder: {
    height: 230,
    radius: 7,
    radialSegments: 20,
    color: `#376ee0`,
    castShadow: true,
    ...reflectivitySettings.soft
  },
  baseSphere: {
    height: 16,
    radius: 16,
    segments: 20,
    color: `#376ee0`,
    ...reflectivitySettings.soft
  },
  baseCylinder: {
    height: 120,
    radius: 16,
    radialSegments: 20,
    color: `#376ee0`,
    ...reflectivitySettings.soft
  }
};

export const pyramidConfig = {
  height: 280,
  radius: getSquareRadius(250),
  radialSegments: 4,
  color: `#1960cf`,
  ...reflectivitySettings.soft
};

export const snowmanConfig = {
  topSphere: {
    radius: 44,
    segments: 20,
    color: colors.SnowColor,
    ...reflectivitySettings.strong
  },
  cone: {
    radius: 18,
    height: 75,
    radialSegments: 20,
    color: colors.Orange,
    ...reflectivitySettings.soft
  },
  baseSphere: {
    radius: 75,
    segments: 20,
    color: colors.SnowColor,
    ...reflectivitySettings.strong
  },
};

export const fencingConfig = {
  name: `fencing`,
  cylinder: {
    height: 100,
    radius: 16,
    radialSegments: 20,
    color: colors.Grey,
  },
  settings: {
    count: 5,
    radius: 670,
    degStart: 0,
    degEnd: 80,
    offset: 15,
  },
};

export const airplaneConfig = {
  name: `airplane`,
  type: `obj`,
  path: `3d/obj/airplane.obj`,
  materialReflectivity: reflectivitySettings.basic,
  color: colors.White,
  scale: {x: 0.7, y: 0.7, z: 0.7},
  finalPosition: {x: 120, y: 30, z: 120},
  position: {x: 80, y: -75, z: -55},
  rotate: {x: -60, y: 45, z: 0},
};
