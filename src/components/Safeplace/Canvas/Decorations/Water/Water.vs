varying vec2 vWorldUv;
varying vec2 vFlowUv;
uniform float uScale;
uniform float uFlowDirection;

vec2 rotateUV(vec2 uv, float rotation)
{
  float mid = 0.5;
  return vec2(
    cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
    cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
  );
}

void main()
{
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vWorldUv = (modelMatrix * vec4(position, 1.)).xz * (1. / uScale);
  vFlowUv = rotateUV(vWorldUv, uFlowDirection);
}
