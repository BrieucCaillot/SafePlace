import { Suspense, useEffect, useMemo } from 'react'
import * as THREE from 'three'

import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'

import SafeplaceSky from '@/components/Safeplace/Canvas/Decorations/SafeplaceSky'

import Waterfall from '@/components/canvas/Waterfall/Waterfall'
import Grass from '@/components/Safeplace/Canvas/Decorations/Grass/Grass'
import Dandelion from '@/components/canvas/Dandelion/Dandelion'
import { useGLTF } from '@react-three/drei'
import Shelter from './Shelter/Shelter'
import ColumnLocation from './ColumLocation/ColumnLocation'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import SafeplaceDebug from './SafeplaceDebug'

const SafeplaceScene = () => {
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)
  const setPOIData = useSafeplaceStore((state) => state.setPOIData)

  /**
   * SET POIS POSITION
   */
  useEffect(() => {
    setPOIData(SafeplacePOI.OnBoarding, {
      position: new THREE.Vector3(0, 6, 50),
    })
    setCurrentPOI(SafeplacePOI.OnBoarding)
  }, [])

  const { scene } = useGLTF('/models/safeplace.glb')

  const [POIs, shelterModel, bridge] = useMemo(() => scene.children, [])

  const columnAssoc: { [name: string]: SafeplacePOI } = {
    POI_1: SafeplacePOI.MountainPedestal,
    POI_2: SafeplacePOI.PlaceholderPedetral1,
    POI_3: SafeplacePOI.PlaceholderPedetral2,
    POI_4: SafeplacePOI.PlaceholderPedetral3,
    POI_5: SafeplacePOI.PlaceholderPedetral4,
  }

  return (
    <>
      <SafeplaceDebug />
      <Shelter object={shelterModel} />

      {POIs.children.map((o) => (
        <ColumnLocation
          safeplacePOI={columnAssoc[o.name]}
          pedestalObj={o}
          key={o.name}
        />
      ))}

      <primitive object={bridge} />

      <SafeplaceSky />

      <Grass position-y={-0.2} />
      <Waterfall position={[-50, 6, 0]} rotation={[0, 45, 0]} />
      <Dandelion position={[50, 6, 0]} rotation={[0, -45, 0]} />

      <pointLight position={[0, 20, 0]} />
    </>
  )
}

export default withScenePortal(SafeplaceScene)
