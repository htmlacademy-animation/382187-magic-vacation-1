import {getSquareRadius} from '../../../helpers';

export const carpetConfig = {
  width: 180,
  depth: 3,
  radius: 763,
  degStart: 16,
  degEnd: 74,
  color: `#A481D1`,
  segments: 40,
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

export const saturnConfig = {
  planet: {
    radius: 60,
    color: `#FF0438`,
    segments: 40,
  },
  ring: {
    width: 40,
    depth: 2,
    radius: 80,
    color: `#7F47EA`,
    segments: 40,
  },
  sphere: {
    radius: 10,
    color: `#7F47EA`,
    segments: 40,
  },
  line: {
    radius: 1,
    height: 1000,
    color: `#7C8DA9`,
    segments: 40,
  }
};

export const lanternConfig = {
  topCap: {
    widthTop: 45,
    widthBottom: 57,
    height: 6,
    color: `#376ee0`,
    radialSegments: 4,
  },
  topTrapezoid: {
    widthTop: 42,
    widthBottom: 34,
    height: 60,
    color: `#9db3ef`,
    radialSegments: 4,
  },
  topBox: {
    width: 37,
    height: 4,
    color: `#376ee0`,
  },
  middleCylinder: {
    height: 230,
    radius: 7,
    radialSegments: 20,
    color: `#376ee0`,
  },
  baseSphere: {
    height: 16,
    radius: 16,
    segments: 20,
    color: `#376ee0`,
  },
  baseCylinder: {
    height: 120,
    radius: 16,
    radialSegments: 20,
    color: `#376ee0`,
  }
};

export const pyramidConfig = {
  height: 280,
  radius: getSquareRadius(250),
  radialSegments: 4,
  color: `#1960cf`,
};

export const snowmanConfig = {
  topSphere: {
    radius: 44,
    segments: 20,
    color: `#bccde6`,
  },
  cone: {
    radius: 18,
    height: 75,
    radialSegments: 20,
    color: `#c44717`,
  },
  baseSphere: {
    radius: 75,
    segments: 20,
    color: `#bccde6`,
  },
};
