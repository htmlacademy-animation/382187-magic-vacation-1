import * as THREE from 'three';
import fragmentShader from './fragment-shader.glsl';
import vertexShader from './vertex-shader.glsl';

class CarpetMaterial extends THREE.ShaderMaterial {
  constructor({
    mainColor,
    stripeColor
  }) {
    let uniforms = {
      mainColor: {value: new THREE.Color(mainColor)},
      stripeColor: {value: new THREE.Color(stripeColor)}
    };
    super({
      uniforms,
      vertexShader,
      fragmentShader,
    });
  }
}

export default CarpetMaterial;
