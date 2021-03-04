precision mediump float;

uniform vec3 uColor;
uniform float uInnerRadius;
uniform float uOuterRadius;
uniform float uOuterThickness;

varying vec2 vUv;

float smoothCircle(float df, float radius) {
  return smoothstep(radius + 0.005, radius - 0.005, df);
}

void main() {
  float df = distance(vUv, vec2(.5));
  float c = smoothCircle(df, (uInnerRadius / 2.));

  float c2 = smoothCircle(df, (uOuterRadius + uOuterThickness / 2.) / 2.)
           - smoothCircle(df, (uOuterRadius - uOuterThickness / 2.) / 2.);

	float alpha = clamp(c + c2, 0., 1.);

  gl_FragColor = vec4(uColor, alpha);
}