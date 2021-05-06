uniform sampler2D uTexture;
varying vec2 vUv;
varying float vGroundValue;

void main()
{
  vec4 texel = texture2D(uTexture, vUv);
  texel.rgb *= vGroundValue;
  #ifdef ALPHATEST
    if (texel.a < ALPHATEST) discard;
  #endif
  gl_FragColor = texel;
}
