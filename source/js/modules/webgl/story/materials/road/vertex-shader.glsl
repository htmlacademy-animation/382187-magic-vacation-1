varying vec2 vUv;
varying vec3 startPos;
varying vec3 vertPos;

void main() {
    vUv = uv;

    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vec4 pos    = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = pos;
    vertPos     = pos.xyz / pos.w;
    startPos    = vertPos;
}
