precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uSpeed;

varying vec2 vUv;

#pragma glslify: remap = require('../../../../../../utils/shaders/remap')

void main() {

  vec2 uv = vUv;
  uv.x += remap(sin(uTime * uSpeed), -1.0, 1., 0.1, 0.3);
  uv.y += remap(sin(uTime * uSpeed), -1.0, 1., -0.09, 0.1);
  vec4 textureColor = texture2D(uTexture, uv);

  gl_FragColor = vec4(textureColor);
}
