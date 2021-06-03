precision mediump float;

uniform sampler2D uTexture;
uniform float uDisplacementAmount;
uniform sampler2D uDepthMap;
uniform vec2 uMousePos;

varying vec2 vUv;

void main() {
  float depth = texture2D(uDepthMap, vUv).r;
  vec4 textureColor = texture2D(uTexture, vUv + uMousePos * uDisplacementAmount * (1. - depth));

  gl_FragColor = vec4(textureColor);
}
