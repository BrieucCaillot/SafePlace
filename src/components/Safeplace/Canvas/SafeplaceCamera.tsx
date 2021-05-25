import { useRef, useMemo, forwardRef, MutableRefObject, useEffect } from 'react'
import * as THREE from 'three'
import mergeRefs from 'react-merge-refs'

import useAnimateVector from '@/hooks/animation/useAnimateVector'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import { useFrame } from 'react-three-fiber'
import { useControls } from 'leva'
import bezier from 'bezier-easing'
import useMouseRotation from '@/hooks/animation/useMouseRotation'

const SafeplaceCamera = forwardRef(
  (_, forwardedRef: MutableRefObject<THREE.Camera>) => {
    const camRef = useRef<THREE.Camera>()
    const groupRef = useRef<THREE.Camera>()
    const setIsCameraTravelling = useSafeplaceStore(
      (state) => state.setIsCameraTravelling
    )

    const { amplitude, easing } = useControls('camera', {
      easing: { min: 0, max: 1, value: 0.02 },
      amplitude: { min: 0, max: Math.PI / 2, value: 0.02 },
    })
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
          ease: bezier(0.45, 0, 0.49, 1),
          duration: 2.5,
          onComplete: () => setIsCameraTravelling(false),
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
        ref: groupRef,
        target: 'position',
      },
      position,
      { ...params, onUpdate: () => camRef.current?.updateMatrixWorld() }
    )
    useAnimateVector({ ref: groupRef, target: 'rotation' }, rotation, params)
    useAnimateVector({ ref: groupRef, target: 'scale' }, scale, params)

    useMouseRotation(camRef, { amplitude, easing })

    return (
      <group ref={groupRef}>
        <perspectiveCamera
          name={'Safeplace Cam'}
          ref={mergeRefs([forwardedRef, camRef])}
          near={0.1}
          far={1000}
          fov={22.9}
        />
      </group>
    )
  }
)

export default SafeplaceCamera
