import { useEffect, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from 'react-three-fiber'
import useCameraStore from '@/stores/useCameraStore'
import useAnimateVector from '@/hooks/animation/useAnimateVector'
import useSafeplaceStore, { POIData } from '@/stores/useSafeplaceStore'

const JourneyCamera = () => {
  const { camera } = useThree()
  const camRef = useRef<THREE.Camera>(camera)
  const setCameraIsTravelling = useCameraStore(
    (state) => state.setCameraIsTravelling
  )

  window.camera = camera

  return null
}

export default JourneyCamera
