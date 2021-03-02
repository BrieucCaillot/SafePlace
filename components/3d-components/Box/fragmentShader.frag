precision mediump float;

uniform vec3 uColor;
uniform float uTime;

varying vec2 vUv;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

void main() {
  float noise = snoise3(vec3(vUv, uTime));
  gl_FragColor = vec4(noise * uColor, 1);
}