import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useControls } from 'leva'
import SafeplaceModel from '@/components/Safeplace/SafeplaceModel'
import SafeplaceSky from '@/components/Safeplace/SafeplaceSky'
import SafeplaceGround from '@/components/Safeplace/SafeplaceGround/SafeplaceGround'
import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'

const SafeplaceCanvas = () => {
  const insideHouseRef = useRef<THREE.Mesh | null>(null)

  const currentPOI = useSafeplaceStore((state) => state.currentPOI)
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)
  const setPOI = useSafeplaceStore((state) => state.setPOI)

  /**
   * Debug
   */
  const { currPOI } = useControls('Safeplace', {
    currPOI: {
      value: currentPOI,
      options: SafeplacePOI,
    },
  })

  useEffect(() => {
    setCurrentPOI(currPOI)
  }, [currPOI])

  /**
   * SET POIS POSITION
   */
  useEffect(() => {
    setPOI(SafeplacePOI.OnBoarding, {
      position: new THREE.Vector3(0, 6, 50),
    })
    setPOI(SafeplacePOI.Inside, {
      position: new THREE.Vector3(0, 6, 0),
    })
  })

  /**
   * SET CURRENT POI ON CLICK INSIDE
   */
  const onClick = () => {
    setCurrentPOI(SafeplacePOI.Inside)
  }

  return (
    <>
      <Suspense fallback={null}>
        <SafeplaceSky />
        <pointLight position={[0, 20, 0]} />
        <mesh ref={insideHouseRef} position={[0, 6, 0]} onClick={onClick}>
          <boxGeometry />
          <meshNormalMaterial />
        </mesh>
        <SafeplaceModel />
        <SafeplaceGround />
      </Suspense>
    </>
  )
}

export default SafeplaceCanvas
