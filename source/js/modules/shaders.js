
export const prepareRawShaderMaterial = (uniforms) => (
  {
    uniforms,
    vertexShader: `
      uniform mat4 projectionMatrix;
      uniform mat4 modelMatrix;
      uniform mat4 viewMatrix;
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
      }
    `,
    fragmentShader: `
      precision mediump float;
      uniform sampler2D map;
      varying vec2 vUv;
      void main() {
        vec4 texel = texture2D(map, vUv);
        gl_FragColor = texel;
      }
    `,
  }
);

export const prepareStoryRawShaderMaterial = (uniforms) => (
  {
    uniforms,
    vertexShader: `
      uniform mat4 projectionMatrix;
      uniform mat4 modelMatrix;
      uniform mat4 viewMatrix;
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
      }
    `,
    fragmentShader: `
      precision mediump float;
      uniform sampler2D map;
      varying vec2 vUv;
      struct optionsStruct {
        float hueShift;
        bool distort;
      };
      uniform optionsStruct options;
      struct bubbleStruct {
        float radius;
        vec2 position;
      };
      struct distortionStruct {
        bubbleStruct bubbles[3];
        vec2 resolution;
      };
      uniform distortionStruct distortion;
      vec3 shiftHue(vec3 color, float shift) {
        const vec3 k = vec3(0.57735, 0.57735, 0.57735);
        float cosAngle = cos(shift);
        return vec3(color * cosAngle + cross(k, color) * sin(shift) + k * dot(k, color) * (1.0 - cosAngle));
      }
      float getOffset(vec2 point, vec2 circle) {
        return sqrt(pow(point.x - circle.x, 2.0) + pow(point.y - circle.y, 2.0));
      }
      bool isCurrentBubble(vec2 point, vec2 circle, float radius, float outlineWidth) {
        float offset = getOffset(point, circle);
        return offset < radius + outlineWidth;
      }
      bool isInsideCircle(vec2 point, vec2 circle, float radius) {
        float offset = getOffset(point, circle);
        return offset < radius;
      }
      bool isCircleOutline(vec2 point, vec2 circle, float radius, float outlineWidth) {
        float offset = getOffset(point, circle);
        return floor(offset) >= floor(radius) && floor(offset) <= floor(radius + outlineWidth);
      }
      vec4 blendOutline(vec4 texture, vec4 outline) {
        return vec4(mix(texture.rgb, outline.rgb, outline.a), texture.a);
      }
      vec4 distort(sampler2D map, distortionStruct distortion) {
        float outlineWidth = 3.0;
        vec4 outlineColor = vec4(1, 1, 1, 0.25);
        vec2 resolution = distortion.resolution;
        bubbleStruct bubble = distortion.bubbles[0];
        vec2 point = gl_FragCoord.xy;

        for (int i = 0; i < 3; i++) {
          bubbleStruct currentBubble = distortion.bubbles[i];
          vec2 currentPosition = currentBubble.position;
          float currentRadius = currentBubble.radius;

          if (isCurrentBubble(point, currentPosition, currentRadius, outlineWidth)) {
            bubble = currentBubble;
          }
        }

        vec2 position = bubble.position;
        float radius = bubble.radius;
        float h = bubble.radius / 2.0;

        float hr = radius * sqrt(1.0 - pow((radius - h) / radius, 2.0));
        float offset = sqrt(pow(point.x - position.x, 2.0) + pow(point.y - position.y, 2.0));

        bool isInsidePoint = isInsideCircle(point, position, hr);
        bool isOutlinePoint = isCircleOutline(point, position, hr, outlineWidth);

        vec2 newPoint = isInsidePoint ? position + (point - position) * (radius - h) / sqrt(pow(radius, 2.0) - pow(offset, 2.0)) : point;

        vec2 newVUv = (newPoint) / resolution;

        if (isOutlinePoint) {
          return blendOutline(texture2D(map, newVUv), outlineColor);
        }

        return texture2D(map, newVUv);
      }

      void main() {
        vec4 result = texture2D(map, vUv);

        if (options.distort) {
          result = distort(map, distortion);
        }

        vec3 hueShifted = shiftHue(result.rgb, options.hueShift);
        result = vec4(hueShifted.rgb, 1);

        gl_FragColor = result;
      }
    `,
  }
);
