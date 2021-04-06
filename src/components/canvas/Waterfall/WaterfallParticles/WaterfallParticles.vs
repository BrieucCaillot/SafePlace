attribute vec2 aPixelPosition;

uniform sampler2D uPosTexture;
uniform float uSize;
uniform float uSizeVariation;

uniform vec3 uStartColor;
uniform vec3 uEndColor;

varying vec3 vColor;

#pragma glslify: ease = require(glsl-easings/quartic-in-out)
#pragma glslify: random2D = require('../../../../utils/shaders/random2D')
#pragma glslify: remap = require('../../../../utils/shaders/remap')

void main() {
  vec3 offset = texture2D(uPosTexture, aPixelPosition).rgb;
  vec4 mPosition = modelMatrix * vec4((position + offset), 1.0);
  vec4 mvPosition = modelViewMatrix * vec4((position + offset), 1.0);

  gl_Position = projectionMatrix * mvPosition;

  float randomSizeFactor = remap(
    ease(random2D(aPixelPosition + 1.)),
    0., 1.,
    1. - uSizeVariation / 2., 1. + uSizeVariation / 2.
  );

  // Size attenuation
  gl_PointSize = uSize;
  gl_PointSize *= randomSizeFactor;
  gl_PointSize *= (1.0 / - mvPosition.z);

  vColor = mix(uStartColor, uEndColor, random2D(aPixelPosition));
}
