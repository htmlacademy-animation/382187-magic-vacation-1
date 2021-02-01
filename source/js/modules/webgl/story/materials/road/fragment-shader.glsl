varying vec2 vUv;

uniform vec3 mainColor;
uniform vec3 stripeColor;

void main() {
  float stripesY = 3.0 * vUv.y;
  float roundedY = floor(stripesY);
  float stripesX = 9.0 * vUv.x;
  float roundedX = floor(stripesX);

  if (
    mod(roundedY, 2.0) == 1.0 &&
    vUv.y < 0.55 && vUv.y > 0.40 &&
    mod(roundedX, 2.0) == 1.0
  )
  {
    gl_FragColor = vec4(stripeColor, 1.0);
  }
  else
  {
    gl_FragColor = vec4(mainColor, 1.0);
  }
}
