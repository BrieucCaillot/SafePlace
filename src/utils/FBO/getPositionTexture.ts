import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import remap from '../math/remap'

export function getPositionTextureFromMesh(
  mesh: THREE.Mesh | null,
  textureSize: THREE.Vector2 | THREE.Vector2Tuple,
  sampleAmount: number = 0,
  customSampler: MeshSurfaceSampler | null = null
): THREE.DataTexture {
  const size = Array.isArray(textureSize) ? textureSize : textureSize.toArray()

  if (mesh === null) throw 'No mesh'
  const amount = sampleAmount || size[0] * size[1]
  const data = new Float32Array(textureSize[0] * textureSize[1] * 4)
  const sampler = customSampler || new MeshSurfaceSampler(mesh).build()
  const position = new THREE.Vector3()
  for (let index = 0; index < amount; index++) {
    sampler.sample(position)
    data[index * 4 + 0] = position.x
    data[index * 4 + 1] = position.y
    data[index * 4 + 2] = position.z
    data[index * 4 + 3] = 0
  }

  const dataTexture = new THREE.DataTexture(
    data,
    size[0],
    size[1],
    THREE.RGBAFormat,
    THREE.FloatType
  )
  dataTexture.needsUpdate = true

  return dataTexture
}

export function getPositionTextureFromBox(
  textureSize: THREE.Vector2Tuple,
  box: THREE.Box3
): THREE.DataTexture {
  const pixelAmount = textureSize[0] * textureSize[1]
  var data = new Float32Array(pixelAmount * 4)
  for (let index = 0; index < pixelAmount; index++) {
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
