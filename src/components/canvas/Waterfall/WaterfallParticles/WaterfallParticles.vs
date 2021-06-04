attribute vec2 aPixelPosition;

uniform sampler2D uPosTexture;
uniform float uSize;
uniform float uSizeVariation;

uniform vec3 uStartColor;
uniform vec3 uEndColor;

uniform float uFoamColorFactor; // = 0.8;
uniform float uFoamSize; // = 3.5;
uniform vec3 uFoamColor; // = vec3(1.); 

varying vec4 vColor;

#pragma glslify: ease = require(glsl-easings/quartic-in-out)
#pragma glslify: easeOut = require(glsl-easings/quadratic-out)
#pragma glslify: random2D = require('../../../../utils/shaders/random2D')
#pragma glslify: remap = require('../../../../utils/shaders/remap')

#include <fog_pars_vertex>

void main() {
  vec4 data = texture2D(uPosTexture, aPixelPosition);
  vec3 offset = data.rgb;
  float collision = clamp(remap(floor(data.w / 1000.), 0., 255., 0., 1.), 0., 1.);
  float collisionFactor = easeOut(collision);

  vec4 mvPosition = modelViewMatrix * vec4((position + offset), 1.0);

  gl_Position = projectionMatrix * mvPosition;

  float randomSizeFactor = remap(
    ease(random2D(aPixelPosition + 1.)),
    0., 1.,
    1. - uSizeVariation / 2., 1. + uSizeVariation / 2.
  );

  float collisionSize = collisionFactor * uFoamSize;

  // Size attenuation
  gl_PointSize = uSize;
  gl_PointSize *= max(randomSizeFactor, collisionSize);
  gl_PointSize *= (1.0 / - mvPosition.z);

  vec3 color = mix(uStartColor, uEndColor, random2D(aPixelPosition));
  color = mix(color, uFoamColor, collision * uFoamColorFactor);
  vColor = vec4(color, 1.);
  
  #include <fog_vertex>
}
