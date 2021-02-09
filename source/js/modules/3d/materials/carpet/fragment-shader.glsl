varying vec2 vUv;

uniform vec3 mainColor;
uniform vec3 stripeColor;

void main() {
  float stripes = 7.0 * vUv.x;
  float rounded = floor(stripes);

  if (mod(rounded, 2.0) == 1.0)
  {
    gl_FragColor = vec4(stripeColor, 1.0);
  }
  else
  {
    gl_FragColor = vec4(mainColor, 1.0);
  }
}
