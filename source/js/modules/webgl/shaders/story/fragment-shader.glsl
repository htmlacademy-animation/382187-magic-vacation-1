#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#define PI 3.1415926535897932384626433832795
#endif

precision mediump float;

struct bubbleStruct {
  float radius;
  vec2 initialPosition;
  vec2 position;
  vec2 finalOffset;
  float positionAmplitude;
  float glareOffset;
  float glareAngleStart;
  float glareAngleEnd;
  float timeout;
};

struct distortionStruct {
  bubbleStruct bubbles[3];
  vec2 resolution;
};

struct optionsStruct {
  float hueShift;
  bool distort;
};

uniform sampler2D map;
uniform float time;
uniform optionsStruct options;
uniform distortionStruct distortion;

varying vec2 vUv;

vec3 shiftHue(vec3 color, float shift);
bool isBetweenAngles(vec2 point, float glareAngleStart, float glareAngleEnd);
float getOffset(vec2 point, vec2 circle);
bool isCurrentBubble(vec2 point, vec2 circle, float radius, float outlineWidth);
bool isInsideCircle(vec2 point, vec2 circle, float radius);
bool isCircleOutline(vec2 point, vec2 circle, float radius, float outlineWidth);
bool isGlarePart(vec2 point, vec2 circle, float radius, float glareWidth, float glareAngleStart, float glareAngleEnd);
vec4 blendOutline(vec4 texture, vec4 outline);
vec2 calculateBubblePosition(bubbleStruct bubble);
vec4 distort(sampler2D map, distortionStruct distortion);

void main() {
  vec4 result = texture2D(map, vUv);

  if (options.distort) {
    result = distort(map, distortion);
  }

  vec3 hueShifted = shiftHue(result.rgb, options.hueShift);
  result = vec4(hueShifted.rgb, 1);

  gl_FragColor = result;
}

vec3 shiftHue(vec3 color, float shift) {
  const vec3 k = vec3(0.57735);
  float cosAngle = cos(shift);
  return vec3(color * cosAngle + cross(k, color) * sin(shift) + k * dot(k, color) * (1.0 - cosAngle));
}

bool isBetweenAngles(vec2 point, float glareAngleStart, float glareAngleEnd) {
  float angle = atan(point.y, point.x);
  return angle >= glareAngleStart && angle <= glareAngleEnd;
}

float getOffset(vec2 point, vec2 circle) {
  return sqrt(pow(point.x - circle.x, 2.0) + pow(point.y - circle.y, 2.0));
}

bool isCurrentBubble(vec2 point, vec2 circle, float radius, float outlineWidth) {
  float offset = distance(point, circle);
  return offset < radius + outlineWidth;
}


bool isInsideCircle(vec2 point, vec2 circle, float radius) {
  float offset = distance(point, circle);
  return offset < radius;
}
bool isCircleOutline(vec2 point, vec2 circle, float radius, float outlineWidth) {
  float offset = distance(point, circle);
  return floor(offset) >= floor(radius) && floor(offset) <= floor(radius + outlineWidth);
}
bool isGlarePart(vec2 point, vec2 circle, float radius, float glareWidth, float glareAngleStart, float glareAngleEnd) {
  return isCircleOutline(point, circle, radius, glareWidth) && isBetweenAngles(point - circle, glareAngleStart, glareAngleEnd);
}

vec4 blendOutline(vec4 texture, vec4 outline) {
  return vec4(mix(texture.rgb, outline.rgb, outline.a), texture.a);
}

vec2 calculateBubblePosition(bubbleStruct bubble) {
  float progress = sin((time - 1.0) * HALF_PI * 0.5) + 1.0 - bubble.timeout / 2.0;
  float y = bubble.initialPosition[1] + progress * (bubble.finalOffset[1]);
  float bubbleOffset = bubble.positionAmplitude * exp(-0.5 * progress) * sin(progress * PI * 6.0);
  float x = bubbleOffset + bubble.initialPosition[0];
  vec2 currentPosition = vec2(x, y);
  return currentPosition;
}

vec4 distort(sampler2D map, distortionStruct distortion) {
  float outlineWidth = 3.0;
  vec4 outlineColor = vec4(1, 1, 1, 0.15);
  vec2 resolution = distortion.resolution;
  bubbleStruct bubble = distortion.bubbles[0];
  vec2 point = gl_FragCoord.xy;

  for (int i = 0; i < 3; i++) {
    bubbleStruct currentBubble = distortion.bubbles[i];

    float currentRadius = currentBubble.radius;
    vec2 currentPosition = calculateBubblePosition(currentBubble);
    currentBubble.position = currentPosition;

    if (isCurrentBubble(point, currentPosition, currentRadius, outlineWidth)) {
      bubble = currentBubble;
    }
  }

  vec2 position = bubble.position;
  float radius = bubble.radius;
  float h = bubble.radius / 2.0;
  float glareAngleStart = bubble.glareAngleStart;
  float glareAngleEnd = bubble.glareAngleEnd;
  float glareOffset = bubble.glareOffset;

  float hr = radius * sqrt(1.0 - pow((radius - h) / radius, 2.0));
  float offset = distance(point, position);

  bool isInsidePoint = isInsideCircle(point, position, hr);
  bool isOutlinePoint = isCircleOutline(point, position, hr, outlineWidth);
  bool isGlarePoint = isGlarePart(point, position, hr * glareOffset, outlineWidth, glareAngleStart, glareAngleEnd);

  vec2 newPoint = isInsidePoint ? position + (point - position) * (radius - h) / sqrt(pow(radius, 2.0) - pow(offset, 2.0)) : point;

  vec2 newVUv = (newPoint) / resolution;

  if (isOutlinePoint || isGlarePoint) {
    return blendOutline(texture2D(map, newVUv), outlineColor);
  }

  return texture2D(map, newVUv);
}
