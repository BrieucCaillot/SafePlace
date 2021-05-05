import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import remap from '../math/remap'

export function getPositionTextureFromMesh(
  sampler: MeshSurfaceSampler,
  textureSize: THREE.Vector2 | THREE.Vector2Tuple,
  sampleAmount: number = 0
): [positionTexture: THREE.DataTexture, uvTexture: THREE.DataTexture] {
  const size = Array.isArray(textureSize) ? textureSize : textureSize.toArray()

  const amount = sampleAmount || size[0] * size[1]
  const positions = new Float32Array(size[0] * size[1] * 4)
  const uvs = new Float32Array(size[0] * size[1] * 4)

  const position = new THREE.Vector3()
  const normal = new THREE.Vector3()
  const color = new THREE.Color()

  for (let index = 0; index < amount; index++) {
    sampler.sample(position, normal, color)
    positions[index * 4 + 0] = position.x
    positions[index * 4 + 1] = position.y
    positions[index * 4 + 2] = position.z
    positions[index * 4 + 3] = 0

    uvs[index * 4 + 0] = color.r
    uvs[index * 4 + 1] = color.g
    uvs[index * 4 + 2] = color.b
    uvs[index * 4 + 3] = 0
  }

  const positionTexture = new THREE.DataTexture(
    positions,
    size[0],
    size[1],
    THREE.RGBAFormat,
    THREE.FloatType
  )
  positionTexture.needsUpdate = true

  const uvTexture = new THREE.DataTexture(
    uvs,
    size[0],
    size[1],
    THREE.RGBAFormat,
    THREE.FloatType
  )
  uvTexture.needsUpdate = true

  return [positionTexture, uvTexture]
}

export function getPositionTextureFromBox(
  textureSize: THREE.Vector2Tuple,
  box: THREE.Box3,
  sampleAmount: number = 0
): THREE.DataTexture {
  const amount = sampleAmount || textureSize[0] * textureSize[1]
  const data = new Float32Array(textureSize[0] * textureSize[1] * 4)
  for (let index = 0; index < amount; index++) {
    data[index * 4 + 0] = remap(Math.random(), [0, 1], [box.min.x, box.max.x])
    data[index * 4 + 1] = remap(Math.random(), [0, 1], [box.min.y, box.max.y])
    data[index * 4 + 2] = remap(Math.random(), [0, 1], [box.min.z, box.max.z])
    data[index * 4 + 3] = 1
  }

  const dataTexture = new THREE.DataTexture(
    data,
    textureSize[0],
    textureSize[1],
    THREE.RGBAFormat,
    THREE.FloatType
  )
  dataTexture.needsUpdate = true

  return dataTexture
}

export function getRandomRotationTexture(
  textureSize: THREE.Vector2Tuple,
  sampleAmount: number = 0
): THREE.DataTexture {
  const amount = sampleAmount || textureSize[0] * textureSize[1]
  const data = new Float32Array(textureSize[0] * textureSize[1] * 4)
  for (let index = 0; index < amount; index++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI * 2

    data[index * 4 + 0] = Math.sin(theta) * Math.cos(phi)
    data[index * 4 + 1] = Math.sin(theta) * Math.sin(phi)
    data[index * 4 + 2] = Math.cos(theta)
    data[index * 4 + 3] = 0
  }

  const dataTexture = new THREE.DataTexture(
    data,
    textureSize[0],
    textureSize[1],
    THREE.RGBAFormat,
    THREE.FloatType
  )
  dataTexture.needsUpdate = true

  return dataTexture
}
