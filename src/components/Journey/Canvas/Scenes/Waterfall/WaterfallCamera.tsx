import { forwardRef, MutableRefObject, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from 'react-three-fiber'
import useThreeAnimation from '@/hooks/animation/useThreeAnimation'

const WaterfallCamera = forwardRef(
  (
    {
      clip,
    }: {
      clip: THREE.AnimationClip
    },
    forwardRef: MutableRefObject<THREE.Camera>
  ) => {
    const containerRef = useRef<THREE.Object3D>(null)

    const animRef = useThreeAnimation({
      clip,
      ref: containerRef,
    })

    useFrame(
      () =>
        containerRef.current != null &&
        animRef.current != null &&
        !animRef.current.paused &&
        containerRef.current.updateMatrixWorld()
    )

    return (
      <>
        <group ref={containerRef}>
          <perspectiveCamera
            ref={forwardRef}
            rotation-x={-Math.PI / 2}
            near={0.1}
            far={1000}
            fov={32.6}
          />
          {/* <mesh>
            <boxBufferGeometry args={[1, 1, 1]} />
            <meshNormalMaterial />
          </mesh> */}
        </group>
      </>
    )
  }
)

export default WaterfallCamera
