import GroupShorthand from '@/components/common/Canvas/GroupShorthand'
import MeshShorthand from '@/components/common/Canvas/MeshShorthand'
import FlowersParams from '@/components/Safeplace/Canvas/Decorations/Flowers/FlowerParams'
import GrassParams from '@/components/Safeplace/Canvas/Decorations/Grass/GrassParams'
import Routes from '@/constants/enums/Routes'
import prepareAttributeForSample from '@/utils/geometry/prepareAttributesForSample'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const CairnGround = ({
  mesh,
  group,
}: {
  mesh: THREE.Mesh
  group: THREE.Group
}) => {
  const shadowTex = useMemo(() => {
    const t = new THREE.TextureLoader().load('/img/journey/shadow_chap1.png')
    t.flipY = false
    return t
  }, [])

  const groundMesh = useMemo(() => {
    prepareAttributeForSample(mesh.geometry)
    ;(mesh.material as THREE.MeshBasicMaterial).vertexColors = false
    return mesh
  }, [])
  const groundMeshRef = useRef<THREE.Mesh>(groundMesh)

  return (
    <GroupShorthand object={group}>
      <MeshShorthand object={groundMesh} />
      <GroupShorthand object={groundMesh}>
        <GrassParams
          targetMeshRef={groundMeshRef}
          folderName={'cairns.greenery'}
          controlsName={'grass'}
          route={Routes.Journey}
          textureName={'grass_chapter_1'}
          grassParams={{
            weightAttribute: 'grassWeight',
            amount: 24576,
            windAmplitude: 0.007,
            size: 0.04,
            windSpeed: 0.25,
          }}
          position={new THREE.Vector3(0, 0.223, 0).add(groundMesh.position)}
          shadowTexture={shadowTex}
        />
        <FlowersParams
          targetMeshRef={groundMeshRef}
          folderName={'cairns.greenery'}
          controlsName={'flowers'}
          route={Routes.Journey}
          flowersParams={{
            weightAttribute: 'flowerWeight1',
            amount: 1280,
            size: 0.28,
          }}
          position={new THREE.Vector3(0, 0.18, 0).add(groundMesh.position)}
          shadowTexture={shadowTex}
        />
      </GroupShorthand>
    </GroupShorthand>
  )
}

export default CairnGround
