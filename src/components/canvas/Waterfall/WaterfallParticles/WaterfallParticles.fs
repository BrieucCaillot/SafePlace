uniform float uAlpha;
varying vec4 vColor;

void main()
{
  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
  float alpha = step(length(uv - vec2(.5)), .5) * uAlpha;

  if (alpha < 0.01) discard;
  gl_FragColor = vec4(vColor.rgb, vColor.a * alpha);
}
