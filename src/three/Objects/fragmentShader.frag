precision mediump float;

float remap(float value, float start1, float stop1, float start2, float stop2)
{
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

void main()
{    
  gl_FragColor = vec4(vec3(1.), 1.);
}
