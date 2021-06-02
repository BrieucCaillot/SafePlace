precision mediump float;

uniform float uTime;
uniform float uWindNoiseSize;
uniform float uWindSpeed;
uniform float uWindAmplitude;

#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)

varying vec2 vUv;

void main() {

  vec3 pos = position;

  vec3 worldPos = (modelMatrix * vec4(pos, 1.)).xyz;

  float windOffsetX = snoise4(vec4(worldPos * uWindNoiseSize, uTime * uWindSpeed));
  float windOffsetY = snoise4(vec4(worldPos * uWindNoiseSize, uTime * uWindSpeed + 100000.));
  float windOffsetZ = snoise4(vec4(worldPos * uWindNoiseSize, uTime * uWindSpeed - 100000.));

  pos.x += windOffsetX * uWindAmplitude;
  pos.y += windOffsetY * uWindAmplitude;
  pos.z += windOffsetZ * uWindAmplitude;

  float windAlpha = step(0.5, color.r);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(mix(pos, position, windAlpha), 1.0);

  vUv = uv;

}
