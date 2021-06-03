uniform sampler2D uTexture;
varying vec2 vUv;
varying float vGroundValue;

#include <fog_pars_fragment>

void main() {
  vec4 texel = texture2D(uTexture, vUv);
  texel.rgb *= vGroundValue;
  #ifdef ALPHATEST
  if(texel.a < ALPHATEST)
    discard;
  #endif
  gl_FragColor = texel;

  #include <fog_fragment>
}
