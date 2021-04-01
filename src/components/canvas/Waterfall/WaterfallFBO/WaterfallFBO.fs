uniform sampler2D uOrigPosTexture;
uniform sampler2D uPosTexture;
uniform float uTime;
uniform vec2 uSize;
uniform vec3 uMousePos;

uniform float uBaseDirection;
uniform float uAngleAmplitude;
uniform float uMovementSpeed;
uniform float uLifeTime;

varying vec2 vUv;

#pragma glslify: random2D = require('../../../../utils/shaders/random2D')
#pragma glslify: remap = require('../../../../utils/shaders/remap')

#define PI 3.14159265

vec3 resetPositions(inout vec3 pos) {
  vec3 resetPos = texture2D(uOrigPosTexture, vUv).rgb;
  pos.xyz = resetPos.xyz;
  return pos;
}


void main()
{
  vec4 data = texture2D(uPosTexture, vUv).rgba;

  vec3 position = data.xyz;

  float seed1 = random2D(vUv);
  float seed2 = random2D(vUv + 1.);

  float angle = uBaseDirection + remap(seed2, 0., 1., -uAngleAmplitude, uAngleAmplitude);
  position.y -= sin(angle) * uMovementSpeed;
  position.x -= cos(angle) * uMovementSpeed;

  float repulseSize = 0.5;
  if (length(uMousePos.xy - position.xy) < repulseSize) {
    vec2 repulse = normalize(position.xy - uMousePos.xy);
    position.xy = uMousePos.xy + repulse * repulseSize;
  }


  float newLife = mod(uTime + remap(seed1, 0., 1., 100., 200.), uLifeTime);
  float oldLife = data.w;
  if (newLife < oldLife) resetPositions(position);
  // if (position.y > 4.) resetPositions(position);

  // float life = uPosTexture.a;
  // if (life > lifeTime) 
  // if (lastValues.x > 2.) lastValues.x = -2.;
  // else lastValues.x = lastValues.x + 0.01;

  gl_FragColor = vec4(position, newLife);
}
