uniform sampler2D uOrigPosTexture;
uniform sampler2D uPosTexture;

uniform float uTime;

uniform vec3 uMousePos;

uniform float uBaseDirection;
uniform float uAngleAmplitude;
uniform float uMovementSpeed;
uniform float uLifeTime;

varying vec2 vUv;

#pragma glslify: random2D = require('../../../../utils/shaders/random2D')
#pragma glslify: remap = require('../../../../utils/shaders/remap')

#define PI 3.14159265

vec3 resetPosition(inout vec3 pos, bool shouldResetPos) {
  vec3 resetPos = texture2D(uOrigPosTexture, vUv).rgb;
  pos = shouldResetPos ? resetPos : pos;
  return pos;
}

vec3 fallOffset(inout vec3 pos, float seed) {
  float angle = uBaseDirection + remap(seed, 0., 1., -uAngleAmplitude, uAngleAmplitude);
  vec3 offset = vec3(sin(angle), cos(angle), 0.);
  pos += offset * uMovementSpeed;
  return pos;
}

vec3 mouseRepulse(inout vec3 pos, float repulseSize) {
  bool shouldRepulse = length(uMousePos.xy - pos.xy) < repulseSize;
  vec2 repulseDir = normalize(pos.xy - uMousePos.xy);

  pos = shouldRepulse
    ? vec3(uMousePos.xy + repulseDir * repulseSize, pos.z)
    : pos;

  return pos;
}


void main()
{
  vec4 data = texture2D(uPosTexture, vUv).rgba;
  float oldLife = data.w;
  vec3 position = data.xyz;

  fallOffset(position, random2D(vUv + 1.));
  mouseRepulse(position, 0.5);

  float newLife = mod(uTime + remap(random2D(vUv), 0., 1., 100., 200.), uLifeTime);
  resetPosition(position, newLife < oldLife);

  gl_FragColor = vec4(position, newLife);
}
