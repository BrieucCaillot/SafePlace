import React, {
  forwardRef,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import * as THREE from 'three'
import { useAnimations, useGLTF } from '@react-three/drei'
import mergeRefs from 'react-merge-refs'

import useJourneyStore from '@/stores/useJourneyStore'
import useSceneStore from '@/stores/useSceneStore'
import useMouseRotation from '@/hooks/animation/useMouseRotation'
import useAsyncEffect from '@/hooks/promise/useAsyncEffect'
import useConfigActions from '@/hooks/animation/useConfigActions'
import useAnimManager from '@/hooks/animation/useAnimManager'
import useAudioManager from '@/hooks/audio/useAudioManager'
import JourneySection from '@/constants/enums/JourneySection'
import SceneName from '@/constants/enums/SceneName'
import Routes from '@/constants/enums/Routes'
import VOICEOVER from '@/constants/VOICEOVER'
import wait from '@/utils/promise/wait'

import withScenePortal from '@/components/common/Scenes/withScenePortal'
import Dandelion from '@/components/canvas/Dandelion/Dandelion'
import CustomSky from '@/components/canvas/Sky/CustomSky'
import MeshShorthand from '@/components/common/Canvas/MeshShorthand'
import LakeGround from '@/components/Journey/Canvas/Scenes/Lake/LakeGround'
import GroupShorthand from '@/components/common/Canvas/GroupShorthand'
import WaterParams from '@/components/Safeplace/Canvas/Decorations/Water/WaterParams'
import SceneShorthand from '@/components/common/Canvas/SceneShorthand'
import TreeParams from '@/components/common/Canvas/Decorations/Trees/TreeParams'

const LakeScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const {
    scene,
    animations: [camAnim],
  } = useGLTF('/models/journey/chapter2.glb')

  const containerRef = useRef<THREE.Group>()
  const localCamRef = useRef<THREE.Camera>()

  const [
    camGroup,
    particules,
    lake,
    dandelion,
    rocks,
    ground,
    trees,
    waterlilies,
  ] = useMemo(
    () =>
      [
        'camera',
        'particules',
        'lake',
        'dandelions',
        'rocks',
        'ground',
        'trees',
        'waterlilies',
      ].map((n) => scene.children.find((o) => o.name === n)),
    []
  )

  const [animatedDandelion, setAnimatedDandelion] = useState<number>(0)
  const isSettledInScene = useSceneStore(
    (s) => !s.inTransition && s.renderedScene === SceneName.Lake
  )
  const willPlay = useSceneStore((s) => s.nextScene === SceneName.Lake)

  const audio = useAudioManager([
    VOICEOVER.JOURNEY.LAKE1,
    VOICEOVER.JOURNEY.LAKE2,
  ])

  const { actions, mixer } = useAnimations([camAnim], containerRef)
  useConfigActions(actions, 'Action.006')
  const anim = useAnimManager(actions, mixer, 'Action.006')

  useEffect(() => {
    if (!willPlay) return
    anim.init()
    setAnimatedDandelion(0)
    return anim.stop
  }, [willPlay])

  // Sequence
  useAsyncEffect(
    async (wrap) => {
      if (!isSettledInScene) return
      const { setSection } = useJourneyStore.getState()

      wrap(wait(3000)).then(() => setAnimatedDandelion(1))
      wrap(wait(9000)).then(() => setAnimatedDandelion(2))
      wrap(wait(15000)).then(() => setAnimatedDandelion(3))
      wrap(wait(20000)).then(() => setAnimatedDandelion(4))

      await wrap(
        Promise.all([
          anim.play(),
          (async () => {
            await wait(2000)
            await audio.play(VOICEOVER.JOURNEY.LAKE1)
            await wait(5000)
            await audio.play(VOICEOVER.JOURNEY.LAKE2)
          })(),
        ])
      )
      await wrap(wait(5000))

      setSection(JourneySection.Waterfall)
    },
    () => audio.stop(),
    [isSettledInScene]
  )

  useMouseRotation(localCamRef, {
    offset: [-Math.PI / 2, 0, 0],
    amplitude: 0.02,
    easing: 0.02,
  })

  return (
    <>
      {/* <ClassicCamera ref={camRef} name='Lake cam' /> */}
      <group
        ref={containerRef}
        position={camGroup.position}
        quaternion={camGroup.quaternion}
      >
        <perspectiveCamera
          ref={mergeRefs([localCamRef, camRef])}
          fov={(camGroup.children[0] as THREE.PerspectiveCamera).fov}
          near={0.1}
          far={1000}
        />
      </group>

      <CustomSky />
      <Dandelion
        points={particules.children}
        position={particules.position}
        rotation={particules.rotation}
        scale={particules.scale}
        sequence={animatedDandelion}
      />
      <WaterParams
        route={Routes.Journey}
        targetMesh={lake.children[0] as THREE.Mesh}
      />
      <MeshShorthand object={dandelion.children[0] as THREE.Mesh} />

      <LakeGround object={ground} />

      <GroupShorthand object={trees}>
        <GroupShorthand object={trees.children[0]}>
          {trees.children[0].children.map((tree) => (
            <TreeParams tree={tree as THREE.Mesh} key={tree.uuid} />
          ))}
        </GroupShorthand>
      </GroupShorthand>

      <SceneShorthand object={rocks} />
      <SceneShorthand object={waterlilies} />
    </>
  )
})

export default withScenePortal(LakeScene)
