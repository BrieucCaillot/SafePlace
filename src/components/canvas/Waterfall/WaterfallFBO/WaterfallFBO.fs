uniform sampler2D uOrigPosTexture;
uniform sampler2D uPosTexture;
uniform float uTime;
uniform vec2 uSize;
varying vec2 vUv;

#pragma glslify: random2D = require('../../../../utils/shaders/random2D')
#pragma glslify: remap = require('../../../../utils/shaders/remap')

vec3 resetPositions(inout vec3 pos) {
  vec3 resetPos = texture2D(uOrigPosTexture, vUv).rgb;
  pos.xyz = resetPos.xyz;
  return pos;
}


void main()
{
  vec4 data = texture2D(uPosTexture, vUv).rgba;

  vec3 position = data.xyz;

  float lifeTime = remap(random2D(vUv), 0., 1., 3., 5.);
  // float lifeTime = 3.;
  float newLife = mod(uTime, lifeTime);
  float oldLife = data.w;
  if (newLife < oldLife) resetPositions(position);


  position.y -= 0.01;

  // float life = uPosTexture.a;
  // if (life > lifeTime) 
  // if (lastValues.x > 2.) lastValues.x = -2.;
  // else lastValues.x = lastValues.x + 0.01;

  gl_FragColor = vec4(position, newLife);
}
