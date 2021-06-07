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

#pragma glslify: export(eulerToQuaternion)
