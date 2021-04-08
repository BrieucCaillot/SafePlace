import { Suspense, useEffect } from 'react'
import * as THREE from 'three'

import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'

import SafeplaceModel from '@/components/Safeplace/Legacy/SafeplaceModel'
import SafeplaceSky from '@/components/Safeplace/Canvas/Decorations/SafeplaceSky'

import Waterfall from '@/components/canvas/Waterfall/Waterfall'
import Grass from '@/components/Safeplace/Canvas/Decorations/Grass/Grass'
import Dandelion from '@/components/canvas/Dandelion/Dandelion'

const SafeplaceCanvas = () => {
  const setPOIData = useSafeplaceStore((state) => state.setPOIData)

  /**
   * SET POIS POSITION
   */
  useEffect(() => {
    setPOIData(SafeplacePOI.OnBoarding, {
      position: new THREE.Vector3(0, 6, 50),
    })
    setPOIData(SafeplacePOI.Inside, {
      position: new THREE.Vector3(0, 6, 0),
    })
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <SafeplaceSky />
        <pointLight position={[0, 20, 0]} />
        <SafeplaceModel />
        <Grass position-y={-0.2} />
        <Waterfall position={[-50, 6, 0]} rotation={[0, 45, 0]} />
        <Dandelion position={[50, 6, 0]} rotation={[0, -45, 0]} />
      </Suspense>
    </>
  )
}

export default SafeplaceCanvas