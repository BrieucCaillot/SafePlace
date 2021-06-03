vec2 polar2cart(vec2 rt) {
  return vec2(rt.x * cos(rt.y), rt.x * sin(rt.y));
}

#pragma glslify: export(polar2cart)
