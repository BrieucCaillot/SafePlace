attribute vec2 aPixelPosition;

uniform sampler2D uPosTexture;
uniform vec3 uWindDirection;
uniform float uSpreadFactor;

uniform float uAnimationProgress;

uniform float uSize;
uniform float uSizeVariation;

uniform vec3 uStartColor;
uniform vec3 uEndColor;

varying vec3 vColor;

#pragma glslify: sizeEase = require(glsl-easings/quartic-in-out)
#pragma glslify: windEase = require(glsl-easings/sine-in)
#pragma glslify: random2D = require('../../../utils/shaders/random2D')
#pragma glslify: remap = require('../../../utils/shaders/remap')

void main() {
  float randomSizeIndex = sizeEase(random2D(aPixelPosition + 1.));

  vec3 orientation = texture2D(uPosTexture, aPixelPosition).rgb;

  float remapProgress = clamp(remap(
    uAnimationProgress,
    random2D(aPixelPosition) * 0.3, 1.,
    0., 1.
  ), 0., 1.);

  vec3 compoOrientation = mix(
    orientation * uSpreadFactor * (1. - randomSizeIndex),
    orientation,
    remapProgress
  );
  vec3 compoWind = mix(
    vec3(0),
    uWindDirection,
    windEase(remapProgress)
  );

  vec3 offset = compoOrientation + compoWind;

  vec4 mvPosition = modelViewMatrix * vec4((position + offset), 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float randomSizeFactor = remap(
    randomSizeIndex,
    0., 1.,
    1. - uSizeVariation / 2., 1. + uSizeVariation / 2.
  );

  // Size attenuation
  gl_PointSize = uSize;
  gl_PointSize *= randomSizeFactor;
  gl_PointSize *= (1.0 / - mvPosition.z);

  vColor = mix(uStartColor, uEndColor, random2D(aPixelPosition));
}
