const polarCoordinates = (
  angle: number,
  distance: number
): [number, number] => [Math.cos(angle) * distance, Math.sin(angle) * distance]

export default polarCoordinates
