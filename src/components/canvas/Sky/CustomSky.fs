varying vec3 vPos;
uniform vec3 uHorizonColor;
uniform vec3 uZenithColor;
uniform vec2 uEasePoint;

float quadraticThroughAGivenPoint (float x, float a, float b){
  
  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  float min_param_b = 0.0;
  float max_param_b = 1.0;
  a = min(max_param_a, max(min_param_a, a));  
  b = min(max_param_b, max(min_param_b, b)); 
  
  float A = (1.-b)/(1.-a) - (b/a);
  float B = (A*(a*a)-b)/a;
  float y = A*(x*x) - B*(x);
  y = min(1.,max(0.,y)); 
  
  return y;
}

void main()
{
  float a = quadraticThroughAGivenPoint(vPos.y, uEasePoint.x, uEasePoint.y);
  gl_FragColor = vec4(mix(uHorizonColor, uZenithColor, a), 1.);
}
