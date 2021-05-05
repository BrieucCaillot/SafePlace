import {
  forwardRef,
  MutableRefObject,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import * as THREE from 'three'
import { useFrame } from 'react-three-fiber'
import useThreeAnimation from '@/hooks/animation/useThreeAnimation'
import useJourneyStore from '@/stores/useJourneyStore'
import JourneySection from '@/constants/enums/JourneySection'

const WaterfallCamera = forwardRef(
  (
    {
      clip,
      onAnimEnd,
    }: {
      clip: THREE.AnimationClip
      onAnimEnd: () => void
    },
    forwardRef: MutableRefObject<THREE.Camera>
  ) => {
    const containerRef = useRef<THREE.Object3D>(null)

    const animRef = useThreeAnimation({
      clip,
      ref: containerRef,
      onFinished: onAnimEnd,
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
