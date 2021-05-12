import * as THREE from 'three'

const prepareAttributeForSample = (geometry: THREE.BufferGeometry) => {
  const uvAttr = geometry.getAttribute('uv')
  const colorAttr = geometry.getAttribute('color')
  const vertexCount = uvAttr.count

  const flowerWeight1 = new Float32Array(vertexCount)
  const grassWeight = new Float32Array(vertexCount)
  const flowerWeight2 = new Float32Array(vertexCount)
  const fakeColor = new Float32Array(vertexCount * 3)

  for (let index = 0; index < vertexCount; index++) {
    fakeColor[index * 3 + 0] = uvAttr.array[index * uvAttr.itemSize + 0]
    fakeColor[index * 3 + 1] = uvAttr.array[index * uvAttr.itemSize + 1]
    fakeColor[index * 3 + 2] = 0
    flowerWeight1[index] = colorAttr.array[index * colorAttr.itemSize + 0]
    grassWeight[index] = colorAttr.array[index * colorAttr.itemSize + 1]
    flowerWeight2[index] = colorAttr.array[index * colorAttr.itemSize + 2]
  }
  geometry.setAttribute(
    'flowerWeight1',
    new THREE.BufferAttribute(flowerWeight1, 1)
  )
  geometry.setAttribute(
    'grassWeight',
    new THREE.BufferAttribute(grassWeight, 1)
  )
  geometry.setAttribute(
    'flowerWeight2',
    new THREE.BufferAttribute(flowerWeight2, 1)
  )
  geometry.setAttribute('color', new THREE.BufferAttribute(fakeColor, 3))
}

export default prepareAttributeForSample
