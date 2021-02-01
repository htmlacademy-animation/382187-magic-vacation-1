varying vec2 vUv;

void main() {
  float stripes = 1.0 * vUv.y;
  float rounded = floor(stripes);

  if (mod(rounded, 2.0) == 1.0)
  {
    gl_FragColor = vec4(0.408, 0.298, 0.651, 1.0);
  }
  else
  {
    gl_FragColor = vec4(0.663, 0.522, 0.847, 1.0);
  }
}
