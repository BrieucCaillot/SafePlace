import { useRef, useMemo, forwardRef, MutableRefObject, useEffect } from 'react'
import * as THREE from 'three'
import mergeRefs from 'react-merge-refs'

import useAnimateVector from '@/hooks/animation/useAnimateVector'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import { useFrame } from 'react-three-fiber'
import { useControls } from 'leva'
import bezier from 'bezier-easing'

const SafeplaceCamera = forwardRef(
  (_, forwardedRef: MutableRefObject<THREE.Camera>) => {
    const camRef = useRef<THREE.Camera>()
    const setIsCameraTravelling = useSafeplaceStore(
      (state) => state.setIsCameraTravelling
    )

    const { amplitude, easing } = useControls('camera', {
      easing: { min: 0, max: 1, value: 0.02 },
      amplitude: { min: 0, max: Math.PI / 2, value: 0.02 },
    })
    const currentPOIData = useSafeplaceStore((s) => s.getPOIData(s.currentPOI))

    const poiEulerRef = useRef(new THREE.Euler())
    const newMousePos = useRef(new THREE.Vector2())

    useEffect(() => {
      const handleMouse = (e: MouseEvent) => {
        newMousePos.current
          .set(
            -((e.clientY / window.innerHeight) * 2 - 1),
            -((e.clientX / window.innerWidth) * 2 - 1)
          )
          .multiplyScalar(amplitude)
      }
      window.addEventListener('mousemove', handleMouse)
      return () => window.removeEventListener('mousemove', handleMouse)
    }, [amplitude])

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
        ref: camRef,
        target: 'position',
      },
      position,
      { ...params, onUpdate: () => camRef.current?.updateMatrixWorld() }
    )
    useAnimateVector(poiEulerRef, rotation, params)
    useAnimateVector(
      {
        ref: camRef,
        target: 'scale',
      },
      scale,
      params
    )

    const mouseEulerRef = useRef(new THREE.Euler())
    const lastMousePos = useRef(new THREE.Vector2())
    const rotationMatricesRef = useRef([
      new THREE.Matrix4(),
      new THREE.Matrix4(),
    ])
    useFrame(() => {
      lastMousePos.current.lerp(newMousePos.current, easing)
      mouseEulerRef.current.set(
        lastMousePos.current.x,
        lastMousePos.current.y,
        0
      )

      // https://www.gamedev.net/forums/topic/540243-combine-euler-angle-rotation/
      const [m1, m2] = rotationMatricesRef.current
      ;(window as any).euler = poiEulerRef.current.toArray()
      m1.makeRotationFromEuler(poiEulerRef.current)
      m2.makeRotationFromEuler(mouseEulerRef.current)
      m1.multiply(m2)
      camRef.current.quaternion.setFromRotationMatrix(m1)
    })

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
