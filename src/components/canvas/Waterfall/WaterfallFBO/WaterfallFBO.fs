uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uSize;
varying vec2 vUv;

void main()
{
  vec3 lastValues = texture2D(uTexture, vUv).rgb;
  // if (lastValues.x > 2.) lastValues.x = -2.;
  // else lastValues.x = lastValues.x + 0.01;
  gl_FragColor = vec4(lastValues, 1.);
}
