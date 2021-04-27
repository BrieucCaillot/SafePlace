import { useRef, useMemo, forwardRef, MutableRefObject } from 'react'
import * as THREE from 'three'
import mergeRefs from 'react-merge-refs'

import useAnimateVector from '@/hooks/animation/useAnimateVector'
import useSafeplaceStore from '@/stores/useSafeplaceStore'

const SafeplaceCamera = forwardRef(
  (_, forwardedRef: MutableRefObject<THREE.Camera>) => {
    const camRef = useRef<THREE.Camera>()
    const setIsCameraTravelling = useSafeplaceStore(
      (state) => state.setIsCameraTravelling
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
          onComplete: () => setIsCameraTravelling(false),
        },
      }

      if (currentPOIData !== undefined) {
        const { position, scale, quaternion } = currentPOIData
        position.toArray(output.position)
        // new THREE.Euler()
        //   .setFromQuaternion(quaternion)
        //   .toArray(output.rotation as THREE.Vector3Tuple)
        scale.toArray(output.scale)
      }

      return output
    }, [currentPOIData])

    console.log(rotation)

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
        // quaternion={[0.7071068286895752, 0, 0, 0.7071067094802856]}
        near={0.1}
        far={1000}
        fov={22.9}
      />
    )
  }
)

export default SafeplaceCamera
