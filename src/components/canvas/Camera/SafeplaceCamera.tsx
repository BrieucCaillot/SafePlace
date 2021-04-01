import { useEffect, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from 'react-three-fiber'
import useCameraStore from '@/stores/useCameraStore'
import useAnimateVector from '@/hooks/animation/useAnimateVector'
import useSafeplaceStore, { POIData } from '@/stores/useSafeplaceStore'

const SafeplaceCamera = () => {
  const { camera } = useThree()
  const camRef = useRef<THREE.Camera>(camera)
  const setCameraIsTravelling = useCameraStore(
    (state) => state.setCameraIsTravelling
  )

  const currentPOIData = useSafeplaceStore((s) => s.getPOIData(s.currentPOI))

  useFrame(({ gl, camera, scene }) => {
    gl.autoClear = true
    gl.render(scene, camera)
  }, 100)

  /**
   * GET NEW CAMERA PARAMS
   */
  const { position, rotation, scale, params } = useMemo(() => {
    const output: {
      position: THREE.Vector3Tuple
      rotation: THREE.Vector3Tuple
      scale: THREE.Vector3Tuple
      params: GSAPTweenVars
    } = {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      params: {
        duration: 2,
        onStart: () => setCameraIsTravelling(true),
        onComplete: () => setCameraIsTravelling(false),
      },
    }

    if (currentPOIData !== undefined) {
      const { position, scale, quaternion } = currentPOIData
      position.toArray(output.position)
      new THREE.Euler()
        .setFromQuaternion(quaternion)
        .toArray(output.rotation as THREE.Vector3Tuple)
      scale.toArray(output.scale)
    }

    return output
  }, [currentPOIData])

  /**
   * ANIMATE CAMERA
   */
  useAnimateVector(
    {
      ref: camRef,
      target: 'position',
    },
    position,
    params
  )
  useAnimateVector(
    {
      ref: camRef,
      target: 'rotation',
    },
    rotation,
    params
  )
  useAnimateVector(
    {
      ref: camRef,
      target: 'scale',
    },
    scale,
    params
  )

  return null
}

export default SafeplaceCamera
