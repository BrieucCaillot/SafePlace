precision mediump float;

varying vec3 vNormal;

uniform vec3 uLightColor;
uniform vec3 uDarkColor;
uniform vec3 uLightDirection;

uniform bool uDebugLight;
uniform bool uDebugNormal;

#pragma glslify: ease = require(glsl-easings/exponential-in)

vec3 packNormalToRGB( const in vec3 normal ) {
    return normalize( normal ) * 0.5 + 0.5;
}

void main() {
  float light = dot(normalize(vNormal), normalize(uLightDirection));
  vec3 color = mix(uDarkColor, uLightColor, ease(clamp(light, 0., 1.)));

  gl_FragColor = vec4(color, 1.);
  if (uDebugLight) {
    gl_FragColor = vec4(vec3(light), 1.);
  }
  if (uDebugNormal) {
    gl_FragColor = vec4(packNormalToRGB(vNormal), 1.);
  }
}
