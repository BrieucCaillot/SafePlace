import { useRef, useMemo, forwardRef, MutableRefObject } from 'react'
import * as THREE from 'three'
import useCameraStore from '@/stores/useCameraStore'
import useAnimateVector from '@/hooks/animation/useAnimateVector'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import mergeRefs from 'react-merge-refs'

const SafeplaceCamera = forwardRef(
  (_, forwardedRef: MutableRefObject<THREE.Camera>) => {
    const camRef = useRef<THREE.Camera>()
    const setCameraIsTravelling = useCameraStore(
      (state) => state.setCameraIsTravelling
    )

    const currentPOIData = useSafeplaceStore((s) => s.getPOIData(s.currentPOI))

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
      { ...params, onUpdate: () => camRef.current?.updateMatrixWorld() }
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

    return (
      <perspectiveCamera
        name={'Safeplace Cam'}
        ref={mergeRefs([forwardedRef, camRef])}
        near={0.1}
        far={1000}
        fov={22.9}
      />
    )
  }
)

export default SafeplaceCamera
