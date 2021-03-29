uniform sampler2D uTexture;
varying vec2 vUv;

void main()
{
  vec3 lastValues = texture2D(uTexture, vUv).rgb;
  if (lastValues.x > 1.) lastValues.x = -1.;
  else lastValues.x = lastValues.x + 0.01;
  gl_FragColor = vec4(lastValues, 1.);
}
