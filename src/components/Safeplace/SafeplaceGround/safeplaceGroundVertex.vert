uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;
uniform sampler2D uHeightMap;
uniform float uHeightMapScale;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying vec2 vUv;
varying float vElevation;

void main() {

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // float elevation = sin(modelPosition.x * uFrequency.x + uTime) * 0.5;
  // elevation += sin(modelPosition.y * uFrequency.y + uTime) * 0.5;

  // modelPosition.y += elevation;
  //   modelPosition.z = sin(modelPosition.x * 10.0) * 0.1;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vUv = uv;
  // vElevation = elevation;
}
