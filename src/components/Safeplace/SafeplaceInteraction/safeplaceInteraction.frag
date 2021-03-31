precision mediump float;

uniform vec2 u_resolution;
uniform vec3 uColor;

varying vec2 vUv;

void main() {
  float strenght = step(0.25, distance(vUv, vec2(0.5)));

  vec4 blackColor = vec4(uColor, 1.0);
  vec4 alphaColor = vec4(1.0, 1.0, 1.0, 0.0);

  vec4 mixedColor = mix(blackColor, alphaColor, strenght);
  gl_FragColor = mixedColor;
}
