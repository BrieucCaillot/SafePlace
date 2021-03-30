import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useControls } from 'leva'
import SafeplaceModel from '@/components/Safeplace/SafeplaceModel'
import SafeplaceSky from '@/components/Safeplace/SafeplaceSky'
import SafeplaceGround from '@/components/Safeplace/SafeplaceGround/SafeplaceGround'
import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import { PointerEvent } from 'react-three-fiber'
import Waterfall from '../canvas/Waterfall/Waterfall'
import Grass from '../canvas/Grass/Grass'

const SafeplaceCanvas = () => {
  const insideHouseRef = useRef<THREE.Mesh | null>(null)

  const currentPOI = useSafeplaceStore((state) => state.currentPOI)
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)
  const setPOIData = useSafeplaceStore((state) => state.setPOIData)

  /**
   * Debug
   */
  const [{ currPOI }, set] = useControls('Safeplace', () => ({
    currPOI: {
      value: currentPOI,
      options: SafeplacePOI,
    },
  }))

  useEffect(() => {
    setCurrentPOI(currPOI)
  }, [currPOI])
  useEffect(
    () =>
      useSafeplaceStore.subscribe(
        (n: SafeplacePOI) => set({ currPOI: n }),
        (s) => s.currentPOI
      ),
    []
  )

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

  /**
   * SET CURRENT POI ON CLICK INSIDE
   */
  const onClick = (e: PointerEvent) => {
    setCurrentPOI(SafeplacePOI.Inside)
  }

  return (
    <>
      <Suspense fallback={null}>
        <SafeplaceSky />
        <pointLight position={[0, 20, 0]} />
        <mesh ref={insideHouseRef} position-y={6} onClick={onClick}>
          <boxGeometry />
          <meshNormalMaterial />
        </mesh>
        <SafeplaceModel />
        <SafeplaceGround />
        <Waterfall position={[-50, 6, 0]} rotation={[0, 45, 0]} />
        <Grass position={[0, 0.1, -60]} />
      </Suspense>
    </>
  )
}

export default SafeplaceCanvas
