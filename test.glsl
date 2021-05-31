// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float remap(float value, float low1, float high1, float low2, float high2) {
  return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
}
float rand(float n){return fract(sin(n) * 43758.5453123);}

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec2 polar2cart(vec2 rt) {
  return vec2(rt.x * cos(rt.y), rt.x * sin(rt.y));
}

vec2 cart2polar(vec2 xy) {
  return vec2(
    sqrt(xy.x * xy.x + xy.y * xy.y),
    atan(xy.y, xy.x)
  );
}

#define PI 3.14159265359

void main() {
  // TODO: utiliser les uv du plane
  // TODO: avoir un curseur de rotation pour faire tourner les sections
  // TODO: intégrer la texture

  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;
  
  vec2 sectionUv = st - .5;
  
  vec2 polar = cart2polar(sectionUv);
  float posterizedAngle = remap(polar.y, -PI, PI, 0., 1.);
  posterizedAngle = floor(posterizedAngle * 18.) / 18.;
  
  float offsetAngle = remap(posterizedAngle + 1. / 36., 0., 1., -PI, PI);
  vec2 offsetDir = polar2cart(vec2(1., offsetAngle));
  
  float offsetAmount = snoise(vec2(rand(posterizedAngle) * 1000., u_time / 10.)) * 0.1;
  
  
  vec2 circleUvs = st + offsetAmount * offsetDir;
  
  // vec3 finalColor = vec3(offsetAmount);
  vec3 finalColor = vec3(step(length(circleUvs - .5), 0.5));


  gl_FragColor = vec4(finalColor, 1.);
}
