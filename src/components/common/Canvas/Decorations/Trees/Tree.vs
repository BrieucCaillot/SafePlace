precision mediump float;

uniform float uTime;
uniform float uWindNoiseSize;
uniform float uWindSpeed;
uniform float uWindAmplitude;

#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)

varying vec2 vUv;

#include <fog_pars_vertex>

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

  pos = mix(pos, position, windAlpha);
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  vUv = uv;

  #include <fog_vertex>
}
