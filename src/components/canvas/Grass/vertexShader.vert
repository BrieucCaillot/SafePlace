uniform sampler2D uPositionTexture;
uniform float uSize;
uniform float uTime;
uniform float uWindNoiseSize;
uniform float uWindAmplitude;
uniform float uWindSpeed;

attribute vec2 aPixelPosition;
attribute vec4 aRotation;

varying vec2 vUv;

#define PI 3.14159265359

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d) 

vec3 transform( inout vec3 position, vec3 T, vec4 R, vec3 S ) {
    //applies the scale
    position *= S;
    //computes the rotation where R is a (vec4) quaternion
    position += 2.0 * cross( R.xyz, cross( R.xyz, position ) + R.w * position );
    //translates the transformed 'blueprint'
    position += T;
    //return the transformed position
    return position;
}
 

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main()
{
  vUv = uv;

  vec3 offset = texture2D(uPositionTexture, aPixelPosition).rgb;
  
  vec3 pos = position;

  transform(pos, offset, aRotation, vec3(uSize));

  vec3 worldPos = (modelMatrix * vec4(pos, 1.)).xyz;

  float windOffsetX = snoise3(vec3(worldPos.xz * uWindNoiseSize, uTime * uWindSpeed));
  float windOffsetY = snoise3(vec3(worldPos.xz * uWindNoiseSize, uTime * uWindSpeed + 100000.));
  pos.x += windOffsetX * uv.y * uWindAmplitude;
  pos.y += windOffsetY * uv.y * uWindAmplitude;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
