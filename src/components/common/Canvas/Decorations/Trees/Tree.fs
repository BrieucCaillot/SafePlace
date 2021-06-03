precision mediump float;

uniform sampler2D uTexture;

varying vec2 vUv;

#include <fog_pars_fragment>

void main() {
  vec4 textureColor = texture2D(uTexture, vUv);

  #ifdef ALPHATEST
  if(textureColor.a < ALPHATEST)
    discard;
  #endif

  gl_FragColor = textureColor;

  #include <fog_fragment>
}
