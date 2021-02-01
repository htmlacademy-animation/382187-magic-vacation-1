import * as THREE from 'three';
import fragmentShader from './fragment-shader.glsl';
import vertexShader from './vertex-shader.glsl';

class RoadMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
    });
  }
}

export default RoadMaterial;
