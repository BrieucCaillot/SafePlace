import { useGLTF } from '@react-three/drei'
import {
  forwardRef,
  MutableRefObject,
  ReactElement,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import * as THREE from 'three'
import { useFrame } from 'react-three-fiber'
import useJourneyStore from '@/stores/useJourneyStore'
import JourneySection from '@/constants/enums/JourneySection'

const LoadAnimations = ({
  onAnimsLoaded,
}: {
  onAnimsLoaded: (clips: THREE.AnimationClip[]) => void
}): ReactElement<any, any> => {
  const gltf = useGLTF('/models/journey/chapter3.glb')
  useEffect(() => {
    onAnimsLoaded(gltf.animations)
  }, [])

  return null
}

const WaterfallCamera = forwardRef(
  (_, forwardRef: MutableRefObject<THREE.Camera>) => {
    const containerRef = useRef<THREE.Object3D>(null)
    const mixerRef = useRef<THREE.AnimationMixer>(null)
    const actionRef = useRef<THREE.AnimationAction>(null)
    const clockRef = useRef<THREE.Clock>(new THREE.Clock(true))
    const section = useJourneyStore((s) => s.currentSection)

    const sectionAssoc = useMemo<{ [key in JourneySection]?: number }>(
      () => ({
        [JourneySection.Bridge]: 0,
        [JourneySection.Waterfall]: 1,
        [JourneySection.Outro]: 2,
      }),
      []
    )

    const [animations, setAnimations] = useState<THREE.AnimationClip[] | null>(
      null
    )
    const saveAnims = useCallback(
      (clips: THREE.AnimationClip[]) =>
        animations === null && setAnimations(clips),
      [animations]
    )

    useEffect(() => {
      if (containerRef.current == null) return
      mixerRef.current = new THREE.AnimationMixer(containerRef.current)
    }, [])

    useFrame(() => {
      if (mixerRef.current == null) return
      mixerRef.current.update(clockRef.current.getDelta())
      if (actionRef.current == null || actionRef.current.paused) return
      containerRef.current.updateMatrixWorld()
    })

    useEffect(() => {
      if (actionRef.current !== null) actionRef.current.stop()
      if (animations == null || !(section in sectionAssoc)) return
      const action = mixerRef.current.clipAction(
        animations[sectionAssoc[section]]
      )
      action.setLoop(THREE.LoopOnce, 1)
      action.clampWhenFinished = true
      action.play()
      actionRef.current = action
    }, [section, animations])

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
          <mesh>
            <boxBufferGeometry args={[1, 1, 1]} />
            <meshNormalMaterial />
          </mesh>
        </group>

        <Suspense fallback='loading'>
          <LoadAnimations onAnimsLoaded={saveAnims} />
        </Suspense>
      </>
    )
  }
)

export default WaterfallCamera
