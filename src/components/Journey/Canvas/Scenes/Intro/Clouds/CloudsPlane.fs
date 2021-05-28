precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uSpeed;

varying vec2 vUv;

void main() {

  vec2 uv = vUv;
  uv.x += uTime * uSpeed;
  vec4 textureColor = texture2D(uTexture, uv);

  gl_FragColor = vec4(textureColor);
}
