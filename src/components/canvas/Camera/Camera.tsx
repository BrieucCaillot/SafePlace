import { useEffect, useRef, useMemo } from 'react'
import { useThree } from 'react-three-fiber'
import { useControls } from 'leva'
import useCameraStore from '@/stores/useCameraStore'
import useAnimateVector from '@/hooks/animation/useAnimateVector'
import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'

const Camera = () => {
  // Store
  const { camera } = useThree()
  const camRef = useRef<THREE.Camera>(camera)
  const setCameraIsTravelling = useCameraStore(
    (state) => state.setCameraIsTravelling
  )

  // POI
  const currentPOI = useSafeplaceStore((state) => state.currentPOI)
  const getPOIData = useSafeplaceStore((state) => state.getPOIData)

  /**
   * Debug
   */
  const { position } = useControls('Camera', {
    position: {
      value: [0, 6, 50],
    },
  })

  useEffect(() => {
    camera.position.fromArray(position)
  }, [position[0], position[1], position[2]])

  /**
   * GET NEW CAMERA PARAMS
   */
  const getNewCameraParams = (
    currentPOI: SafeplacePOI
  ): [[number, number, number], GSAPTweenVars] => {
    const currentPOIObj = getPOIData(currentPOI)

    let camPosition: [number, number, number] = [0, 6, 50]
    const GSAPparams: GSAPTweenVars = {
      duration: 2,
      onStart: () => setCameraIsTravelling(true),
      onComplete: () => setCameraIsTravelling(false),
    }

    if (currentPOIObj === undefined) return [camPosition, GSAPparams]

    const { x, y, z } = currentPOIObj.position
    camPosition = [x, y, z]

    return [camPosition, GSAPparams]
  }

  const [camPos, camAnimParams] = useMemo(
    () => getNewCameraParams(currentPOI),
    [currentPOI]
  )

  /**
   * ANIMATE CAMERA
   */
  useAnimateVector(
    {
      ref: camRef,
      target: 'position',
    },
    camPos,
    camAnimParams
  )

  return null
}

export default Camera
