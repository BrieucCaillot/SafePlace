export function map(
  value: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
) {
  return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
}

export function lerp(start: number, end: number, alpha: number) {
  return (1 - alpha) * start + alpha * end
}
