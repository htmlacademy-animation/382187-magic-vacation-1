precision mediump float;

uniform sampler2D map;

struct optionsStruct {
  float hueShift;
  bool distort;
};

uniform optionsStruct options;

struct bubbleStruct {
  float radius;
  float glareOffset;
  float glareAngleStart;
  float glareAngleEnd;
  vec2 position;
};

struct distortionStruct {
  bubbleStruct bubbles[3];
  vec2 resolution;
};

uniform distortionStruct distortion;

varying vec2 vUv;

vec3 hueShift(vec3 color, float shift);
bool isBetweenAngles(vec2 point, float glareAngleStart, float glareAngleEnd);
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

  vec3 hueShifted = hueShift(result.rgb, options.hueShift);
  result = vec4(hueShifted.rgb, 1);

  gl_FragColor = result;
}

vec3 hueShift(vec3 color, float hue) {
  const vec3 k = vec3(0.57735);
  float cosAngle = cos(hue);
  return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
}

bool isBetweenAngles(vec2 point, float glareAngleStart, float glareAngleEnd) {
  float angle = atan(point.y, point.x);
  return angle >= glareAngleStart && angle <= glareAngleEnd;
}

bool isCurrentBubble(vec2 point, vec2 circle, float radius, float outlineThickness) {
  float offset = distance(point, circle);
  return offset < radius + outlineThickness;
}

bool isInsideCircle(vec2 point, vec2 circle, float radius) {
  float offset = distance(point, circle);
  return offset < radius;
}

bool isCircleOutline(vec2 point, vec2 circle, float radius, float outlineThickness) {
  float offset = distance(point, circle);
  return floor(offset) >= floor(radius) && floor(offset) <= floor(radius + outlineThickness);
}

bool isGlarePart(vec2 point, vec2 circle, float radius, float flareThickness, float glareAngleStart, float glareAngleEnd) {
  bool isBetweenFlareAngles = isBetweenAngles(point - circle, glareAngleStart, glareAngleEnd);
  bool isWithinFlareOutline = isCircleOutline(point, circle, radius, flareThickness);

  return isBetweenFlareAngles && isWithinFlareOutline;
}

vec4 blendOutline(vec4 texture, vec4 outline) {
  return vec4(mix(texture.rgb, outline.rgb, outline.a), texture.a);
}

vec4 distort(sampler2D map, distortionStruct distortion) {
  float outlineThickness = 3.0;
  vec4 outlineColor = vec4(1, 1, 1, 0.15);

  float flareThickness = outlineThickness;
  vec4 flareColor = outlineColor;

  vec2 resolution = distortion.resolution;
  bubbleStruct bubble = distortion.bubbles[0];
  vec2 point = gl_FragCoord.xy;

  for (int index = 0; index < 3; index++) {
    bubbleStruct currentBubble = distortion.bubbles[index];

    vec2 currentPosition = currentBubble.position;
    float currentRadius = currentBubble.radius;

    if (isCurrentBubble(point, currentPosition, currentRadius, outlineThickness)) {
      bubble = currentBubble;
    }
  }

  vec2 position = bubble.position;
  float radius = bubble.radius;
  float glareAngleStart = bubble.glareAngleStart;
  float glareAngleEnd = bubble.glareAngleEnd;
  float glareOffset = bubble.glareOffset;

  float h = bubble.radius / 2.0;

  float hr = radius * sqrt(1.0 - pow((radius - h) / radius, 2.0));
  float offset = distance(point, position);

  bool pointIsInside = isInsideCircle(point, position, hr);
  bool pointIsOutline = isCircleOutline(point, position, hr, outlineThickness);
  bool pointIsGlare = isGlarePart(point, position, hr * glareOffset, flareThickness, glareAngleStart, glareAngleEnd);

  vec2 newPoint = pointIsInside ? (point - position) * (radius - h) / sqrt(pow(radius, 2.0) - pow(offset, 2.0)) + position : point;

  vec2 newVUv = (newPoint) / resolution;

  if (pointIsOutline) {
    return blendOutline(texture2D(map, newVUv), outlineColor);
  }

  if (pointIsGlare) {
    return blendOutline(texture2D(map, newVUv), flareColor);
  }

  return texture2D(map, newVUv);
}
