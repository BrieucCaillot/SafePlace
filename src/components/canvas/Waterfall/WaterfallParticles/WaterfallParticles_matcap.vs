attribute vec2 aPixelPosition;

uniform sampler2D uPosTexture;
uniform float uSize;
uniform float uAmplitude;

varying vec3 vViewPosition;
varying vec3 vNormal;

void main() {
  vec3 offset = texture2D(uPosTexture, aPixelPosition).rgb;
  vec4 mPosition = modelMatrix * vec4((position + offset), 1.0);
  vec4 mvPosition = modelViewMatrix * vec4((position + offset), 1.0);

  gl_Position = projectionMatrix * mvPosition;

  // Size attenuation
  gl_PointSize = uSize;
  gl_PointSize *= (1.0 / - mvPosition.z);


  vViewPosition = - mvPosition.xyz;
  vNormal = normalize(cameraPosition - mPosition.xyz);
}
