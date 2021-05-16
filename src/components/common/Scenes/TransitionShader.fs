varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uInProgress;
uniform float uOutProgress;

void main()
{
  vec4 t = texture2D(uTexture, vUv);
  gl_FragColor = mix(t, vec4(1.), uOutProgress - uInProgress);
}
