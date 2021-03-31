attribute vec2 aPixelPosition;
uniform sampler2D uTexture;
uniform float uSize;
uniform float uAmplitude;

void main() {
  vec3 offset = texture2D(uTexture, aPixelPosition).rgb;
  gl_Position = projectionMatrix * modelViewMatrix * vec4((position * uSize) + offset * uAmplitude, 1.0);
}
