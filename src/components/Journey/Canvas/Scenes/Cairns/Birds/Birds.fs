#include <fog_pars_fragment>

uniform vec3 uColor;

void main() {
  gl_FragColor = vec4(uColor, 1.);

  #include <fog_fragment>

  #ifdef ALPHATEST
    if(gl_FragColor.a < ALPHATEST) discard;
  #endif
}
