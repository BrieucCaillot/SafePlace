import { useMemo, useRef } from 'react'
import * as THREE from 'three'

import MeshShorthand from '@/components/common/Canvas/MeshShorthand'
import GrassParams from '@/components/Safeplace/Canvas/Decorations/Grass/GrassParams'
import Routes from '@/constants/enums/Routes'
import FlowersParams from '@/components/Safeplace/Canvas/Decorations/Flowers/FlowerParams'
import prepareAttributeForSample from '@/utils/geometry/prepareAttributesForSample'

const LakeGround = ({ object }: { object: THREE.Object3D }) => {
  const groundRef = useRef<THREE.Mesh>()

  const groundMesh = useMemo(() => {
    const mesh = object.children[0] as THREE.Mesh
    prepareAttributeForSample(mesh.geometry)
    ;(mesh.material as THREE.MeshBasicMaterial).vertexColors = false
    return mesh
  }, [object])
  const shadowTex = useMemo(() => {
    const t = new THREE.TextureLoader().load('/img/journey/shadow_chap2.png')
    t.flipY = false
    return t
  }, [])

  return (
    <>
      <MeshShorthand object={groundMesh} ref={groundRef} visible={true} />
      <GrassParams
        targetMeshRef={groundRef}
        folderName={'lake_greenery'}
        controlsName={'grass'}
        route={Routes.Journey}
        grassParams={{ weightAttribute: 'grassWeight', amount: 4096 }}
        textureName={'grass_chapter_1'}
        position={new THREE.Vector3(0, 0.4, 0).add(groundMesh.position)}
        shadowTexture={shadowTex}
      />
      <FlowersParams
        targetMeshRef={groundRef}
        folderName={'lake_greenery'}
        controlsName={'flowers'}
        route={Routes.Journey}
        flowersParams={{ weightAttribute: 'flowerWeight1', amount: 1024 }}
        position={groundMesh.position}
        shadowTexture={shadowTex}
      />
    </>
  )
}

export default LakeGround
