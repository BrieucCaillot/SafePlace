import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

import MeshShorthand from '@/components/common/Canvas/MeshShorthand'
import GrassParams from '@/components/Safeplace/Canvas/Decorations/Grass/GrassParams'
import Routes from '@/constants/enums/Routes'
import prepareAttributeForSample from '@/utils/geometry/prepareAttributesForSample'

const WaterfallGround = ({ object }: { object: THREE.Mesh }) => {
  const groundRef = useRef<THREE.Mesh>()

  const groundMesh = useMemo(() => {
    const mesh = object as THREE.Mesh
    prepareAttributeForSample(mesh.geometry)
    ;(mesh.material as THREE.MeshBasicMaterial).vertexColors = false
    return mesh
  }, [object])
  const shadowTex = useMemo(
    () => new THREE.TextureLoader().load('/img/common/empty.png'),
    []
  )

  const [pos, setPos] = useState<THREE.Vector3>(new THREE.Vector3())
  useEffect(
    () => setPos(new THREE.Vector3(0, 1, 0).add(groundMesh.position)),
    []
  )

  return (
    <>
      <MeshShorthand object={groundMesh} ref={groundRef} />
      <GrassParams
        targetMeshRef={groundRef}
        folderName={'waterfall_greenery'}
        controlsName={'grass'}
        route={Routes.Journey}
        grassParams={{ weightAttribute: 'grassWeight', amount: 16, size: 10 }}
        position={pos}
        scale={groundMesh.scale}
        shadowTexture={shadowTex}
      />
    </>
  )
}

export default WaterfallGround
