uniform sampler2D uOrigPosTexture;
uniform sampler2D uPosTexture;

uniform float uTime;
uniform float uDelta;

uniform vec3 uMousePos;
uniform vec3 uSdfOffset;
uniform float uSlatOffset;
uniform vec3 uSlatsPos[5];

uniform float uAngleAmplitude;
uniform float uMovementSpeed;
uniform float uLifeTime;
uniform float uRounding;
uniform bool uDoesIntersect;
uniform float uCursorSize;
uniform float uCursorVar;

uniform float uFoamDuration; //= 0.58;
uniform float uFoamDurationVar; //= 0.1;
uniform float uFoamSensitivity; //= 0.9;
uniform float uFoamSensitivityVar; //= 0.1;

uniform float uWindIntensity;
uniform float uWindFrequency;

varying vec2 vUv;

#pragma glslify: quarticOut = require(glsl-easings/quartic-out)
#pragma glslify: random2D = require('../../../../utils/shaders/random2D')
#pragma glslify: remap = require('../../../../utils/shaders/remap')
#pragma glslify: cartesian2polar = require('../../../../utils/shaders/cartesian2polar')

#define PI 3.14159265

const float EPSILON = .01;

vec4 eulerToQuaternion(vec3 e)
{
    float cx = cos(e.x*0.5);
    float cy = cos(e.y*0.5);    
    float cz = cos(e.z*0.5);
    float sx = sin(e.x*0.5);
    float sy = sin(e.y*0.5);    
    float sz = sin(e.z*0.5);

    vec4 q = vec4(0.);
    q.w = (cz*cx*cy)+(sz*sx*sy);
    q.x = (cz*sx*cy)-(sz*cx*sy);
    q.y = (cz*cx*sy)+(sz*sx*cy);
    q.z = (sz*cx*cy)-(cz*sx*sy);
    return q;        
}


float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}
float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}
float sdRoundBox( vec3 p, vec3 b, float r )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
}
float sdEllipsoid( vec3 p, vec3 r )
{
  float k0 = length(p/r);
  float k1 = length(p/(r*r));
  return k0*(k0-1.0)/k1;
}
float sdCylinder( vec3 p, vec3 c )
{
  return length(p.xy-c.xy)-c.z;
}
vec3 rotateVector( vec4 quat, vec3 vec ){
  return vec + 2.0 * cross( cross( vec, quat.xyz ) + quat.w * vec, quat.xyz );
}
float opSmoothUnion( float d1, float d2, float k ) {
  float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
  return mix( d2, d1, h ) - k*h*(1.0-h);
}

vec3 resetPosition(inout vec3 pos, bool shouldResetPos) {
  vec3 resetPos = texture2D(uOrigPosTexture, vUv).rgb;
  pos = shouldResetPos ? resetPos : pos;
  return pos;
}

vec3 fakeVelocity(float seed, float seed2) {
  float theta = uAngleAmplitude;
  float z = remap(seed, 0., 1., cos(theta), 1.);
  float phi = remap(seed2, 0., 1., 0., 2. * PI);

  vec3 normDir = normalize(vec3(
    sqrt(1.-z*z) * cos(phi),
    sqrt(1.-z*z) * sin(phi),
    z
  ));
  vec3 coneToZ = normDir * uMovementSpeed * uDelta;
  float x = uTime * uWindFrequency;
  float wind = (sin(x) + sin(2.2*x+5.52) + sin(2.9*x+0.93) + sin(4.6*x+8.94)) * uWindIntensity;
  vec4 toBottomQuaternion = eulerToQuaternion(vec3(PI / 2., wind, 0.));
  return -rotateVector(toBottomQuaternion, coneToZ);
}

float sdScene(vec3 pos) {
  float d = 0.;
  // Insert here
  float x = uTime * uWindFrequency;
  float rSize = (sin(x) + sin(2.2*x+5.52) + sin(2.9*x+0.93) + sin(4.6*x+8.94)) * 0.5;
  float a = mod(cartesian2polar((uMousePos - pos).xy).y + uTime, PI);
  float as = (((sin(a * 5.) + sin(a * 2.5 + 2.5) * 0.7 + sin(a * 10. + 8.41) * 0.3) / 2.) + .5);
  float size = uDoesIntersect ? uCursorSize + as * rSize * uCursorVar : 0.;
  d = min(sdCylinder(uMousePos - pos, vec3(0., 0., size)), d);

  return d;
}

vec3 calcSceneNormal(vec3 p, float e) {
  const vec3 v1 = vec3( 1.0,-1.0,-1.0);
  const vec3 v2 = vec3(-1.0,-1.0, 1.0);
  const vec3 v3 = vec3(-1.0, 1.0,-1.0);
  const vec3 v4 = vec3( 1.0, 1.0, 1.0);

  return normalize( v1 * sdScene(p + v1 * e) +
                    v2 * sdScene(p + v2 * e) +
                    v3 * sdScene(p + v3 * e) +
                    v4 * sdScene(p + v4 * e) );
}

vec4 sceneCollision(vec3 pos, vec3 v) {
  float x = pos.x * 0.2 + 10.;
  float n = (sin(x) + sin(2.2*x+5.52) + sin(2.9*x+0.93) + sin(4.6*x+8.94));
  n = remap(n, -1., 1., 0., 0.2);
  vec3 p = pos + v + uSdfOffset - vec3(0.,n,0.);
  float d = sdScene(p);
  vec3 normal = calcSceneNormal(p, EPSILON);

  return vec4(normal, d);
}

void main()
{
  float seed1 = random2D(vUv);
  float seed2 = random2D(vUv + 1.);
  float seed3 = random2D(vUv + 2.);
  float seed4 = random2D(vUv + 3.);
  float seed5 = random2D(vUv + 4.);

  float collisionFadeDuration = remap(seed4, 0., 1.,
    uFoamDuration - uFoamDurationVar / 2.,
    uFoamDuration + uFoamDurationVar / 2.
  );
  float collisionSensitivity = remap(seed5, 0., 1.,
    uFoamSensitivity - uFoamSensitivityVar / 2.,
    uFoamSensitivity + uFoamSensitivityVar / 2.
  );

  vec4 data = texture2D(uPosTexture, vUv).rgba;
  float lastLife = mod(data.w, 1000.);
  float lastCollision = clamp(remap(floor(data.w / 1000.), 0., 255., 0., 1.), 0., 1.);
  vec3 position = data.xyz;

  vec3 v = fakeVelocity(seed1, seed2);
  
  vec4 collision = sceneCollision(position, v);
  vec3 cNormal = collision.xyz;
  float cDF = collision.w;
  float collide = step(cDF, 0.); // 0. if cDF is above 0., 1. otherwise
  vec3 cV =  cNormal * -cDF * collide;

  float relevantCollide = collide * step(collisionSensitivity, dot(cNormal, vec3(0., 1., 0.)));
  float lastCollide = step(0.05, lastCollision);
  
  // Set collision to one if it just collided
  float newCollisionInput = (1. - lastCollide) * relevantCollide * 1.;
  
  // Last collision but faded
  float collisionFade = uDelta / collisionFadeDuration;
  float fadedCollision = clamp(lastCollision - collisionFade, 0., 1.);
  
  // Cap collision if it's currently colliding
  float newCollision = clamp(newCollisionInput + fadedCollision, 0.1 * relevantCollide, 1.);

  v += cV;
  position += v;

  float newLife = mod(uTime + remap(seed3, 0., 1., 100., 200.), uLifeTime);
  resetPosition(position, newLife < lastLife);
  // newLife += 1000. * floor(remap(newCollision, 0., 1., 0., 255.));
  newLife += 1000. * floor(remap(newCollision, 0., 1., 0., 255.));

  gl_FragColor = vec4(position, newLife);
}
