uniform sampler2D uOrigPosTexture;
uniform sampler2D uPosTexture;

uniform float uTime;
uniform float uDelta;

uniform vec3 uMousePos;
uniform vec3 uSdfOffset;
uniform vec3 uSlatsPos[5];

uniform float uAngleAmplitude;
uniform float uMovementSpeed;
uniform float uLifeTime;
uniform float uRounding;
uniform bool uDoesIntersect;
uniform float uCursorSize;

varying vec2 vUv;

#pragma glslify: random2D = require('../../../../utils/shaders/random2D')
#pragma glslify: remap = require('../../../../utils/shaders/remap')

#define PI 3.14159265

const float EPSILON = .01;


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
  vec4 toBottomQuaternion = vec4(0.7071067811865475, 0., 0., 0.7071067811865475);
  return -rotateVector(toBottomQuaternion, coneToZ);
}

float sdScene(vec3 pos) {
  float d = 0.;
  // Insert here
  d = min(sdCylinder(uMousePos - pos, vec3(0., 0., uDoesIntersect ? uCursorSize : 0.)), d);

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

vec3 sceneVelocity(vec3 pos, vec3 v) {
  float x = pos.x * 0.2 + 10.;
  float n = (sin(x) + sin(2.2*x+5.52) + sin(2.9*x+0.93) + sin(4.6*x+8.94));
  n = remap(n, -1., 1., 0., 0.2);
  vec3 p = pos + v + uSdfOffset - vec3(0.,n,0.);
  float d = sdScene(p);
  vec3 normal = calcSceneNormal(p, EPSILON);

  return d < 0. ? normal * -d : vec3(0.);
}

void main()
{
  vec4 data = texture2D(uPosTexture, vUv).rgba;
  float oldLife = data.w;
  vec3 position = data.xyz;


  vec3 v = fakeVelocity(random2D(vUv + 1.), random2D(vUv + 2.));
  
  v += sceneVelocity(position, v);
  position += v;

  float newLife = mod(uTime + remap(random2D(vUv), 0., 1., 100., 200.), uLifeTime);
  resetPosition(position, newLife < oldLife);

  gl_FragColor = vec4(position, newLife);
}
