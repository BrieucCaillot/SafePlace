uniform sampler2D uTexture;
varying vec2 vUv;

void main()
{
  vec4 texel = texture2D(uTexture, vUv);
  #ifdef ALPHATEST
    if (texel.a < ALPHATEST) discard;
  #endif
  gl_FragColor = texel;
}
