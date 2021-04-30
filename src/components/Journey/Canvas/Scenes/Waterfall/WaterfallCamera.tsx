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
      clips,
    }: {
      clips: THREE.AnimationClip[]
    },
    forwardRef: MutableRefObject<THREE.Camera>
  ) => {
    const containerRef = useRef<THREE.Object3D>(null)

    const setSection = useJourneyStore((s) => s.setSection)
    const section = useJourneyStore((s) => s.currentSection)
    const currentClip = useMemo(() => {
      switch (section) {
        case JourneySection.Bridge:
        case JourneySection.ToBridge:
          return clips[0]
        case JourneySection.Waterfall:
          return clips[1]
        case JourneySection.Outro:
          return clips[2]
        default:
          return null
      }
    }, [section])

    const onAnimEnd = useCallback(() => {
      if (section === JourneySection.ToBridge) setSection(JourneySection.Bridge)
    }, [section])

    const animRef = useThreeAnimation({
      clip: currentClip,
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
            fov={90}
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
