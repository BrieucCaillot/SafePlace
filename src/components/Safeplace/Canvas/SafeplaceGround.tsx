import { useMemo } from 'react'
import * as THREE from 'three'
import MeshShorthand from '@/components/common/Canvas/MeshShorthand'
import FlowersParams from './Decorations/Flowers/FlowerParams'
import useWatchableRef from '@/hooks/useWatchableRef'
import GrassParams from './Decorations/Grass/GrassParams'

const SafeplaceGround = ({ groundMesh }: { groundMesh: THREE.Mesh }) => {
  const groundMeshRef = useWatchableRef<THREE.Mesh>(null)

  const ground = useMemo(() => {
    const uvAttr = groundMesh.geometry.getAttribute('uv')
    const colorAttr = groundMesh.geometry.getAttribute('color')
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
    groundMesh.geometry.setAttribute(
      'flowerWeight1',
      new THREE.BufferAttribute(flowerWeight1, 1)
    )
    groundMesh.geometry.setAttribute(
      'grassWeight',
      new THREE.BufferAttribute(grassWeight, 1)
    )
    groundMesh.geometry.setAttribute(
      'flowerWeight3',
      new THREE.BufferAttribute(flowerWeight2, 1)
    )
    groundMesh.geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(fakeColor, 3)
    )
    ;(groundMesh.material as THREE.MeshBasicMaterial).vertexColors = false
    return groundMesh
  }, [])

  const shadowTexture = useMemo(() => {
    const t = new THREE.TextureLoader().load(
      '/img/safeplace/shadow_safeplace.png'
    )
    t.flipY = false
    return t
  }, [])
  return (
    <>
      <MeshShorthand object={ground} ref={groundMeshRef} />
      <GrassParams
        shadowTexture={shadowTexture}
        targetMeshRef={groundMeshRef}
      />
      <FlowersParams
        shadowTexture={shadowTexture}
        targetMeshRef={groundMeshRef}
      />
    </>
  )
}

export default SafeplaceGround
