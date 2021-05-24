import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import MeshShorthand from '@/components/common/Canvas/MeshShorthand'
import FlowersParams from './Decorations/Flowers/FlowerParams'
import GrassParams from './Decorations/Grass/GrassParams'
import Routes from '@/constants/enums/Routes'
import prepareAttributeForSample from '@/utils/geometry/prepareAttributesForSample'

const SafeplaceGround = ({
  groundMesh,
  journeyIsComplete,
}: {
  groundMesh: THREE.Mesh
  journeyIsComplete: boolean
}) => {
  const groundMeshRef = useRef<THREE.Mesh>(null)

  const ground = useMemo(() => {
    prepareAttributeForSample(groundMesh.geometry)
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

  const [mountainBaking, emptyBaking] = useMemo(
    () => [
      (groundMesh.material as THREE.MeshBasicMaterial).map,
      new THREE.TextureLoader().load(
        '/img/safeplace/sol_bake_before.jpg',
        (t) => ((t.flipY = false), (t.encoding = THREE.sRGBEncoding))
      ),
    ],
    []
  )
  useEffect(() => {
    ;(groundMesh.material as THREE.MeshBasicMaterial).map = journeyIsComplete
      ? mountainBaking
      : emptyBaking
  }, [journeyIsComplete])

  return (
    <>
      <MeshShorthand object={ground} ref={groundMeshRef} visible={false} />
      <GrassParams
        controlsName={'safeplace_grass'}
        route={Routes.Safeplace}
        //---
        targetMeshRef={groundMeshRef}
        shadowTexture={shadowTexture}
      />
      {/* <FlowersParams
        controlsName={'red_flower'}
        route={Routes.Safeplace}
        //---
        textureName={'red_flower'}
        flowersParams={{ weightAttribute: 'flowerWeight1' }}
        //---
        targetMeshRef={groundMeshRef}
        shadowTexture={shadowTexture}
      />
      <FlowersParams
        controlsName={'blue_flower'}
        route={Routes.Safeplace}
        //---
        textureName={'blue_flower'}
        flowersParams={{ weightAttribute: 'flowerWeight2', amount: 600 }}
        //---
        targetMeshRef={groundMeshRef}
        shadowTexture={shadowTexture}
      /> */}
    </>
  )
}

export default SafeplaceGround
