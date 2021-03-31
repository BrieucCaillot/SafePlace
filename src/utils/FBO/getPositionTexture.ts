import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'

export default function getPositionTexture(
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
