#ifdef USE_LOGDEPTHBUF
#define EPSILON 1e-6
#ifdef USE_LOGDEPTHBUF_EXT
varying float vFragDepth;
#endif
uniform float logDepthBufFC;
#endif

varying vec3 vNormal;

varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  #ifdef USE_LOGDEPTHBUF
    gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;
  #ifdef USE_LOGDEPTHBUF_EXT
    vFragDepth = 1.0 + gl_Position.w;
  #else
    gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;
  #endif
  #endif
}
