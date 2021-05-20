import React, {
  forwardRef,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

import useJourneyStore from '@/stores/useJourneyStore'
import useAudioStore from '@/stores/useAudioStore'
import useThreeAnimation from '@/hooks/animation/useThreeAnimation'
import JourneySection from '@/constants/enums/JourneySection'
import Place from '@/constants/enums/Place'
import Ambiants from '@/constants/enums/Ambiant'
import { VoiceoverJourney } from '@/constants/enums/Voiceover'

import withScenePortal from '@/components/common/Scenes/withScenePortal'
import ClassicCamera from '@/components/common/Canvas/ClassicCamera'
import Dandelion from '@/components/canvas/Dandelion/Dandelion'
import CustomSky from '@/components/canvas/Sky/CustomSky'
import AudioStatus from '@/constants/enums/Audio'
import ColumnLink from '@/components/Safeplace/Canvas/ColumLocation/ColumnLink/ColumnLink'
import MeshShorthand from '@/components/common/Canvas/MeshShorthand'
import LakeGround from './LakeGround'
import useSceneStore from '@/stores/useSceneStore'
import GroupShorthand from '@/components/common/Canvas/GroupShorthand'
import WaterParams from '@/components/Safeplace/Canvas/Decorations/Water/WaterParams'
import Routes from '@/constants/enums/Routes'

const LakeScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const {
    scene,
    animations: [camAnim],
  } = useGLTF('/models/journey/chapter2.glb')

  const containerRef = useRef<THREE.Group>()

  const [camGroup, particules, lake, dandelion, rocks, ground, trees] = useMemo(
    () =>
      [
        'camera',
        'particules',
        'lake',
        'dandelions',
        'rocks',
        'ground',
        'trees',
      ].map((n) => scene.children.find((o) => o.name === n)),
    []
  )

  const [areDandelionAnimated, animateDandelion] = useState<boolean>(false)

  const isVoiceoverFinished = useAudioStore((s) =>
    s.checkVoiceoverStatus(VoiceoverJourney.Lake1, AudioStatus.Played)
  )
  const isLakeSection = useJourneyStore(
    (s) => s.currentSection === JourneySection.Lake
  )
  const inSceneTransition = useSceneStore((s) => s.inTransition)

  const animRef = useThreeAnimation({
    clip: areDandelionAnimated ? camAnim : null,
    // clip: null,
    ref: containerRef,
    onFinished: () =>
      useJourneyStore.getState().setSection(JourneySection.Waterfall),
  })
  useFrame(
    () =>
      animRef.current != null &&
      !animRef.current.paused &&
      containerRef.current != null &&
      containerRef.current.updateMatrixWorld()
  )

  const dandelionPoints = useMemo(
    () => particules.children.map((o) => o.position),
    []
  )

  useEffect(() => {
    if (!isLakeSection || inSceneTransition) return
    const { setCurrentAmbiant, setCurrentVoiceover } = useAudioStore.getState()
    // Ambiant
    setCurrentAmbiant(Place.Journey, Ambiants.Lake)
    // Voiceover
    setCurrentVoiceover(Place.Journey, VoiceoverJourney.Lake1)
  }, [isLakeSection, inSceneTransition])

  return (
    <>
      {/* <ClassicCamera ref={camRef} name='Lake cam' /> */}
      <group
        ref={containerRef}
        position={camGroup.position}
        quaternion={camGroup.quaternion}
      >
        <ClassicCamera
          ref={camRef}
          fov={(camGroup.children[0] as THREE.PerspectiveCamera).fov}
          rotation-x={-Math.PI / 2}
          position={[0, 0, 0]}
        />
      </group>

      <CustomSky />
      <ColumnLink
        onColumnClick={() => animateDandelion(true)}
        show={isVoiceoverFinished && !areDandelionAnimated}
        position={[-16, 0.5, 3]}
      />
      <Dandelion
        points={dandelionPoints}
        position={particules.position}
        rotation={particules.rotation}
        scale={particules.scale}
        animate={areDandelionAnimated}
      />
      <WaterParams
        route={Routes.Journey}
        targetMesh={lake.children[0] as THREE.Mesh}
      />
      <MeshShorthand object={dandelion.children[0] as THREE.Mesh} />

      <LakeGround object={ground} />

      <GroupShorthand object={trees}>
        <GroupShorthand object={trees.children[0]}>
          {trees.children[0].children.map((o) => (
            <MeshShorthand object={o as THREE.Mesh} key={o.uuid} />
          ))}
        </GroupShorthand>
      </GroupShorthand>

      <GroupShorthand object={rocks}>
        <MeshShorthand object={rocks.children[0] as THREE.Mesh} />
      </GroupShorthand>
    </>
  )
})

export default withScenePortal(LakeScene)
