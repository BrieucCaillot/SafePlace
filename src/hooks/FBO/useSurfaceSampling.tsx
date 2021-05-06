import { getPositionTextureFromMesh } from '@/utils/FBO/getPositionTexture'
import { RefObject, useEffect, useMemo } from 'react'
import { Vector2Tuple } from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import useWatchableRef from '../useWatchableRef'

const useSurfaceSampling = (
  surfaceMeshRef: RefObject<THREE.Mesh>,
  textureSize: Vector2Tuple,
  amount: number,
  weightAttribute: string = null
) => {
  const uvTextureRef = useWatchableRef<THREE.Texture>(null)
  const positionTextureRef = useWatchableRef<THREE.Texture>(null)
  useEffect(() => {
    const [uvTex, posTex] = getPositionTextureFromMesh(
      new MeshSurfaceSampler(surfaceMeshRef.current)
        .setWeightAttribute(weightAttribute)
        .build(),
      textureSize,
      amount
    )
    uvTextureRef.current = uvTex
    positionTextureRef.current = posTex
  }, [textureSize[0], textureSize[1], amount])
  return [uvTextureRef, positionTextureRef]
}

export default useSurfaceSampling
