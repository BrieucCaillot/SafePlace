#include <fog_pars_vertex>

attribute vec3 aPosition;
attribute vec4 aDirection;
attribute float aIndex;
attribute float aSequence;

uniform float uSize;
uniform float uSpeed;
uniform float uSpeedVar;
uniform float uTime;
uniform float uTimeVariation;
uniform float uSequenceTimestamp[4];
uniform float uWingSpeed;
uniform float uWingAmplitude;

#pragma glslify: ease = require(glsl-easings/sine-in)

#define PI 3.14159265

float rand(float n){return fract(sin(n) * 43758.5453123);}

vec3 transform(inout vec3 position, vec3 T, vec4 R, vec3 S) {
    //applies the scale
  position *= S;
    //computes the rotation where R is a (vec4) quaternion
  position += 2.0 * cross(R.xyz, cross(R.xyz, position) + R.w * position);
    //translates the transformed 'blueprint'
  position += T;
    //return the transformed position
  return position;
}

void main() {

  float seed = rand(aIndex);
  float seed2 = rand(aIndex + 1.);
  float seed3 = rand(aIndex + 2.);

  float timeOffset = ease(seed) * uTimeVariation;
  float time = uTime - uSequenceTimestamp[int(aSequence)] - timeOffset;
  float started = step(0., time);
  time = clamp(time, 0., 10000.);

  float wingSpeed = uWingSpeed * (1. + (seed3 - 0.5) * 2. * uSpeedVar);
  float wingAngle = sin(uTime * wingSpeed + seed2 * PI * 2.) * uWingAmplitude;
  vec3 wingPosition = vec3(sign(position.x) * 2. * cos(wingAngle), sin(wingAngle), position.z);
  vec3 pos = mix(position, wingPosition, uv.x) * started;
  
  vec3 direction = vec3(0., 1., 0.);
  transform(direction, vec3(0.), aDirection, vec3(1.));
  float speed = uSpeed * (1. + (seed3 - 0.5) * 2. * uSpeedVar);

  vec3 offset = aPosition + direction * time * speed;

  transform(pos, offset, aDirection, vec3(uSize));
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  #include <fog_vertex>
}
