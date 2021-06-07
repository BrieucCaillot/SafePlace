import remap from './remap'
import * as THREE from 'three'

const randomVectorInCone = (theta: number, target: THREE.Vector3) => {
  const z = remap(Math.random(), [0, 1], [Math.cos(theta), 1])
  const phi = remap(Math.random(), [0, 1], [0, 2 * Math.PI])

  target.set(
    Math.sqrt(1 - z * z) * Math.cos(phi),
    Math.sqrt(1 - z * z) * Math.sin(phi),
    z
  )
  target.normalize()
}

export default randomVectorInCone
