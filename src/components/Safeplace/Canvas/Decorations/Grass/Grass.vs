uniform sampler2D uPositionTexture;
uniform sampler2D uUvTexture;
uniform sampler2D uGroundTexture;
uniform float uSize;
uniform float uTime;
uniform float uWindNoiseSize;
uniform float uWindAmplitude;
uniform float uWindSpeed;

attribute vec2 aPixelPosition;
attribute vec4 aRotation;

varying vec2 vUv;
varying float vGroundValue;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

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

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

#include <fog_pars_vertex>

void main() {

  vUv = uv;
  vec2 globalUv = texture2D(uUvTexture, aPixelPosition).xy;
  vec4 groundColor = texture2D(uGroundTexture, globalUv);
  vGroundValue = rgb2hsv(groundColor.rgb).z;

  vec3 offset = texture2D(uPositionTexture, aPixelPosition).rgb;

  vec3 pos = position;

  transform(pos, offset, aRotation, vec3(uSize));

  vec3 worldPos = (modelMatrix * vec4(pos, 1.)).xyz;

  float windOffsetX = snoise3(vec3(worldPos.xz * uWindNoiseSize, uTime * uWindSpeed));
  float windOffsetZ = snoise3(vec3(worldPos.xz * uWindNoiseSize, uTime * uWindSpeed + 100000.));
  pos.x += windOffsetX * uv.y * uWindAmplitude;
  pos.z += windOffsetZ * uv.y * uWindAmplitude;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  vec3 mvPosition = (vec4(pos, 1.0) * modelViewMatrix).xyz;
  #include <fog_vertex>
}
