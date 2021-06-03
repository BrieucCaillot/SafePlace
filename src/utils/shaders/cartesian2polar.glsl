vec2 cart2polar(vec2 xy) {
  return vec2(
    sqrt(xy.x * xy.x + xy.y * xy.y),
    atan(xy.y, xy.x)
  );
}

#pragma glslify: export(cart2polar)
