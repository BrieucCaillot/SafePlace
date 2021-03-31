export default function pow2roundup(x: number) {
  if (x < 0) return 0
  --x
  x |= x >> 1
  x |= x >> 2
  x |= x >> 4
  x |= x >> 8
  x |= x >> 16
  return x + 1
}
