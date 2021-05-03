uniform sampler2D uOrigPosTexture;
uniform sampler2D uPosTexture;

uniform float uTime;

uniform vec3 uMousePos;
uniform vec3 uSdfOffset;

uniform float uBaseDirection;
uniform float uAngleAmplitude;
uniform float uMovementSpeed;
uniform float uLifeTime;
uniform float uRounding;
uniform float uCursorSize;

varying vec2 vUv;

#pragma glslify: random2D = require('../../../../utils/shaders/random2D')
#pragma glslify: remap = require('../../../../utils/shaders/remap')

#define PI 3.14159265

const float EPSILON = .01;

// vec3 mouseRepulse(vec3 pos, float repulseSize) {
//   vec3 pp = uMousePos - pos;
//   float d = sdSphere(pp, repulseSize);

//   vec3 normal = normalize(-pp);

//   return d < 0. ? normal * -d : vec3(0.);
// }

// vec3 waterfallBack(vec3 pos) {
//   vec3 p = vec3(0.9156076610088348, 4.378834366798401, -1.3927675783634186);
//   vec3 pp = p - pos;
//   // Quaternion
//   vec4 q = vec4(-0.07798528671264648, 0., 0., 0.9969545006752014);
//   // Box size
//   vec3 b = vec3(1.70634463429451, 1.3555799424648285, 0.37881817668676376);
  
//   float d = sdBox(rotateVector(q, pp), b);
//   vec3 normal = -calcBoxNormal(pp, q, b, EPSILON);

//   return d < 0. ? normal * -d : vec3(0.);
// }

// vec3 waterfallMiddle(vec3 pos) {
//   vec3 p = vec3(0.8683604747056961, 1.4525379240512848, -0.712292492389679);
//   vec3 pp = p - pos;
//   // Quaternion
//   vec4 q = vec4(0., 0., 0., 1.);
//   // Box size
//   vec3 b = vec3(1.71309694647789, 1.6624484956264496, 1.1046463996171951);
  
//   float d = sdBox(rotateVector(q, pp), b);
//   vec3 normal = -calcBoxNormal(pp, q, b, EPSILON);

//   return d < 0. ? normal * -d : vec3(0.);
// }

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
float sdCylinder( vec3 p, vec3 c )
{
  return length(p.xy-c.xy)-c.z;
}
vec3 rotateVector( vec4 quat, vec3 vec ){
  return vec + 2.0 * cross( cross( vec, quat.xyz ) + quat.w * vec, quat.xyz );
}
vec3 calcBoxNormal(vec3 p, vec4 q, vec3 b, float e) {
  const vec3 v1 = vec3( 1.0,-1.0,-1.0);
  const vec3 v2 = vec3(-1.0,-1.0, 1.0);
  const vec3 v3 = vec3(-1.0, 1.0,-1.0);
  const vec3 v4 = vec3( 1.0, 1.0, 1.0);

  return normalize( v1 * sdBox( rotateVector( q, p + v1 * e ), b ) +
                    v2 * sdBox( rotateVector( q, p + v2 * e ), b ) +
                    v3 * sdBox( rotateVector( q, p + v3 * e ), b ) +
                    v4 * sdBox( rotateVector( q, p + v4 * e ), b ) );
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
  vec3 coneToZ = normDir * uMovementSpeed;
  vec4 toBottomQuaternion = vec4(0.7071067811865475, 0., 0., 0.7071067811865475);
  return -rotateVector(toBottomQuaternion, coneToZ);
}

float sdScene(vec3 pos) {
  float d = 0.;

  // Waterfall_back
  vec3 p1 = vec3(0.9156099706888199, 4.378829896450043, -2.1366499364376068);
  vec4 q1 = vec4(-0.07798528671264648, 0., 0., 0.9969545006752014);
  vec3 s1 = vec3(5.0873038470745087, 5.061842530965805, 1.1149679869413376);
  float d1 = sdBox(rotateVector(q1, p1 - pos), s1);
  // Waterfall_Middle
  vec3 p2 = vec3(0.8683604747056961, 1.4525379240512848, -1.652292492389679);
  vec4 q2 = vec4(0., 0., 0., 1.);
  vec3 s2 = vec3(5.71309694647789, 1.6624484956264496, 1.1046463996171951);
  float d2 = sdRoundBox(rotateVector(q2, p2 - pos), s2, 0.8);
  d = opSmoothUnion(d1, d2, uRounding);
  // // Right_wall_bottom
  // vec3 p6 = vec3(2.503381669521332, 1.2432478368282318, -0.712292492389679);
  // vec4 q6 = vec4(0., 0., 0., 1.);
  // vec3 s6 = vec3(0.2372048377990723, 1.713334619998932, 2.3606477677822113);
  // float d6 = sdRoundBox(rotateVector(q6, p6 - pos), s6, 0.4);
  // d = opSmoothUnion(d, d6, 0.5);
  // Waterfall_Bottom
  vec3 p3 = vec3(0.8683604747056961, -0.4426690936088562, 1.6026581823825836);
  vec4 q3 = vec4(0., 0., 0., 1.);
  vec3 s3 = vec3(5.71309694647789, 1.19881278052926064, 2.4813516438007355);
  float d3 = sdBox(rotateVector(q3, p3 - pos), s3);
  d = opSmoothUnion(d, d3, 0.5);
  // Left_wall
  vec3 p4 = vec3(-1.5518383979797363, 2.721625566482544, -0.712292492389679);
  vec4 q4 = vec4(0., 0., 0., 1.);
  vec3 s4 = vec3(0.3431517258286476, 5.311665952205658, 2.3606479167938232);
  d = min(sdBox(rotateVector(q4, p4 - pos), s4), d);
  // Right_wall_top
  vec3 p5 = vec3(3.420714318752289, 4.4228971004486084, -0.712292492389679);
  vec4 q5 = vec4(0., 0., 0., 1.);
  vec3 s5 = vec3(0.5431517258286476, 5.5155038237571716, 2.3606477677822113);
  d = min(sdBox(rotateVector(q5, p5 - pos), s5), d);
  // Mouse
  d = min(sdCylinder(uMousePos + uSdfOffset - pos, vec3(0., 0., uCursorSize)), d);

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

vec3 sceneVelocity(vec3 pos) {
  float d = sdScene(pos + uSdfOffset);
  vec3 normal = calcSceneNormal(pos + uSdfOffset, EPSILON);

  return d < 0. ? normal * -d : vec3(0.);
}

void main()
{
  vec4 data = texture2D(uPosTexture, vUv).rgba;
  float oldLife = data.w;
  vec3 position = data.xyz;


  vec3 v = fakeVelocity(random2D(vUv + 1.), random2D(vUv + 2.));
  
  v += sceneVelocity(position);
  position += v;

  float newLife = mod(uTime + remap(random2D(vUv), 0., 1., 100., 200.), uLifeTime);
  resetPosition(position, newLife < oldLife);

  gl_FragColor = vec4(position, newLife);
}
