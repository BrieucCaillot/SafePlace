uniform sampler2D uPositionTexture;
uniform float uSize;
uniform float uTime;
uniform float uWindNoiseSize;
uniform float uWindAmplitude;
uniform float uWindSpeed;

attribute vec2 aPixelPosition;

varying vec2 vUv;

#define PI 3.14159265359

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d) 

mat4 rotation3d(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat4(
		oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
		0.0,                                0.0,                                0.0,                                1.0
	);
}

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main()
{
  vUv = uv;

  vec3 offset = texture2D(uPositionTexture, aPixelPosition).rgb;
  mat4 rotation = rotation3d(vec3(0., 0., 1.), rand(aPixelPosition) * PI);
  vec3 newPos = (rotation * vec4(position, 1.0)).xyz;
  newPos = (newPos * uSize) + offset;

  vec3 worldPos = (modelMatrix * vec4(newPos, 1.)).xyz;

  float windOffsetX = snoise3(vec3(worldPos.xz * uWindNoiseSize, uTime * uWindSpeed));
  float windOffsetY = snoise3(vec3(worldPos.xz * uWindNoiseSize, uTime * uWindSpeed + 100000.));
  newPos.x += windOffsetX * uv.y * uWindAmplitude;
  newPos.y += windOffsetY * uv.y * uWindAmplitude;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
