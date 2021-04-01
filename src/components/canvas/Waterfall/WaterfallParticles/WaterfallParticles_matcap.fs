uniform float uAlpha;
uniform sampler2D uMatcap;
uniform sampler2D uNormalMap;

varying vec3 vNormal;
varying vec3 vViewPosition;

void main()
{
  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);

  // vec3 normal = normalize(vNormal);
  vec3 normalColor = texture2D(uNormalMap, uv).rgb;
  vec3 normal = (normalColor - 0.5) * 2.;

  vec3 viewDir = normalize(vViewPosition);
  vec3 x = normalize(vec3(viewDir.z, 0.0, - viewDir.x));
  vec3 y = cross(viewDir, x);
  vec2 matcapUv = vec2(dot(x, normal), dot(y, normal)) * 0.495 + 0.5;
  vec4 matcapColor = texture2D(uMatcap, matcapUv);

  float alpha = step(length(uv - vec2(.5)), .5) * uAlpha;

  if (alpha < 0.5) discard;
  gl_FragColor = vec4(matcapColor.rgb, alpha);
  // gl_FragColor = vec4(normalColor, alpha);
}
