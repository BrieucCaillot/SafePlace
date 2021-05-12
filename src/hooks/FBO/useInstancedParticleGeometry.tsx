import { useMemo } from 'react'
import * as THREE from 'three'

const useInstancedParticleGeometry = (
  origGeometry: THREE.BufferGeometry,
  textureSize: THREE.Vector2Tuple,
  amount: number
) => {
  return useMemo(() => {
    const geometry = new THREE.InstancedBufferGeometry()

    geometry.instanceCount = amount

    Object.keys(origGeometry.attributes).forEach((attributeName) => {
      geometry.attributes[attributeName] =
        origGeometry.attributes[attributeName]
    })
    geometry.index = origGeometry.index

    const index = new Float32Array(amount)

    for (let i = 0; i < amount; i++) index[i] = i
    geometry.setAttribute(
      'aIndex',
      new THREE.InstancedBufferAttribute(index, 1, false)
    )

    const pixelPos = new Float32Array(amount * 2)
    for (let i = 0; i < amount; i++) {
      pixelPos[i * 2] = (i % textureSize[0]) / textureSize[0]
      pixelPos[i * 2 + 1] = Math.floor(i / textureSize[0]) / textureSize[1]
    }
    geometry.setAttribute(
      'aPixelPosition',
      new THREE.InstancedBufferAttribute(pixelPos, 2, false)
    )
    return geometry
  }, [amount, textureSize[0], textureSize[1]])
}

export default useInstancedParticleGeometry
