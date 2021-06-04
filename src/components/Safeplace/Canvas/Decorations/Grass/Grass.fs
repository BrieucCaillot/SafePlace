uniform sampler2D uTexture;
varying vec2 vUv;
varying float vGroundValue;

#include <fog_pars_fragment>

void main() {
  vec4 texel = texture2D(uTexture, vUv);
  texel.rgb *= vGroundValue;
  gl_FragColor = texel;

  #include <fog_fragment>

  #ifdef ALPHATEST
    if(gl_FragColor.a < ALPHATEST) discard;
  #endif
}
