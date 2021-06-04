attribute vec2 aPixelPosition;
attribute float aSequence;

uniform sampler2D uPosTexture;
uniform vec3 uWindDirection;
uniform float uSpreadFactor;

uniform float uWindSpeed;
uniform float uWindEase;
uniform float uWindEaseDuration;
uniform float uDetachSpeed;
uniform float uDetachEase;
uniform float uDetachEaseDuration;

uniform float uTime;
uniform float uTimeVariation;
uniform float uSequenceTimestamp[4];

uniform float uSize;
uniform float uSizeVariation;

uniform vec3 uStartColor;
uniform vec3 uEndColor;

varying vec3 vColor;

// http://www.flong.com/archive/texts/code/shapers_exp/
float exponentialEasing (float x, float a){
  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  a = max(min_param_a, min(max_param_a, a));
  
  if (a < 0.5){
    // emphasis
    a = 2.0*(a);
    float y = pow(x, a);
    return y;
  } else {
    // de-emphasis
    a = 2.0*(a-0.5);
    float y = pow(x, 1.0/(1.-a));
    return y;
  }
}

float easeTime(float t, float speed, float ease, float easeDuration) {
  return (exponentialEasing(t * easeDuration, ease) / easeDuration) * speed;
}

#pragma glslify: sizeEase = require(glsl-easings/quartic-in-out)
#pragma glslify: windEase = require(glsl-easings/quartic-out)
#pragma glslify: random2D = require('../../../utils/shaders/random2D')
#pragma glslify: remap = require('../../../utils/shaders/remap')

#include <fog_pars_vertex>

void main() {
  float seed1 =  random2D(aPixelPosition);
  float seed2 =  random2D(aPixelPosition + 1.);
  float seed3 =  random2D(aPixelPosition + 2.);

  // Random size
  float randomSizeFactor = sizeEase(seed1);
  randomSizeFactor = remap(
    randomSizeFactor,
    0., 1.,
    -1., 1.
  );
  randomSizeFactor = 1. + (randomSizeFactor * uSizeVariation) / 2.;

  float timeOffset = remap(seed2, 1., -1., 0., uTimeVariation);

  vec3 direction = normalize(texture2D(uPosTexture, aPixelPosition).rgb);
  vec3 origPos = direction * uSpreadFactor * (1. - randomSizeFactor);
  float time = clamp(uTime - uSequenceTimestamp[int(aSequence)] - timeOffset, 0., 10000.);
  
  vec3 offset =
    normalize(uWindDirection) * easeTime(time, uWindSpeed, uWindEase, uWindEaseDuration)
    + direction * easeTime(time, uDetachSpeed, uDetachEase, uDetachEaseDuration);


  vec4 mvPosition = modelViewMatrix * vec4((origPos + position + offset), 1.0);
  gl_Position = projectionMatrix * mvPosition;


  // Size attenuation
  gl_PointSize = uSize;
  gl_PointSize *= randomSizeFactor;
  gl_PointSize *= (1.0 / - mvPosition.z);

  vColor = mix(uStartColor, uEndColor, seed3);
  
  #include <fog_vertex>
}
