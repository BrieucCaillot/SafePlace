import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

import MeshShorthand from '@/components/common/Canvas/MeshShorthand'
import GrassParams from '@/components/Safeplace/Canvas/Decorations/Grass/GrassParams'
import Routes from '@/constants/enums/Routes'
import FlowersParams from '@/components/Safeplace/Canvas/Decorations/Flowers/FlowerParams'
import prepareAttributeForSample from '@/utils/geometry/prepareAttributesForSample'
import { useControls } from 'leva'

const LakeGround = ({ object }: { object: THREE.Object3D }) => {
  const groundRef = useRef<THREE.Mesh>()

  const groundMesh = useMemo(() => {
    const mesh = object.children[0] as THREE.Mesh
    prepareAttributeForSample(mesh.geometry)
    ;(mesh.material as THREE.MeshBasicMaterial).vertexColors = false
    return mesh
  }, [object])

  return (
    <>
      <MeshShorthand object={groundMesh} ref={groundRef} />
      <GrassParams
        targetMeshRef={groundRef}
        folderName={'lake_greenery'}
        controlsName={'grass'}
        route={Routes.Journey}
        grassParams={{ weightAttribute: 'grassWeight', amount: 4096 }}
        position={new THREE.Vector3(0, 0.4, 0).add(groundMesh.position)}
      />
      <FlowersParams
        targetMeshRef={groundRef}
        folderName={'lake_greenery'}
        controlsName={'flowers'}
        route={Routes.Journey}
        flowersParams={{ weightAttribute: 'flowerWeight1', amount: 1024 }}
        position={groundMesh.position}
      />
    </>
  )
}

export default LakeGround
