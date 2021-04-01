attribute vec2 aPixelPosition;
uniform sampler2D uPosTexture;
uniform float uSize;
uniform float uAmplitude;

void main() {
  vec3 offset = texture2D(uPosTexture, aPixelPosition).rgb;
  gl_Position = projectionMatrix * modelViewMatrix * vec4((position * uSize) + offset, 1.0);
}
