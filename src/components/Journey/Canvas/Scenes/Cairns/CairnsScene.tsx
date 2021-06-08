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

import withScenePortal from '@/components/common/Scenes/withScenePortal'
import CustomSky from '@/components/canvas/Sky/CustomSky'

import SceneName from '@/constants/enums/SceneName'
import JourneySection from '@/constants/enums/JourneySection'
import VOICEOVER from '@/constants/VOICEOVER'

import CairnGround from '@/components/Journey/Canvas/Scenes/Cairns/CairnGround'
import wait from '@/utils/promise/wait'
import useConfigActions from '@/hooks/animation/useConfigActions'
import useAnimManager from '@/hooks/animation/useAnimManager'
import useAudioManager from '@/hooks/audio/useAudioManager'
import GroupShorthand from '@/components/common/Canvas/GroupShorthand'
import MeshShorthand from '@/components/common/Canvas/MeshShorthand'
import TreeParams from '@/components/common/Canvas/Decorations/Trees/TreeParams'
import FlyingRocks from '@/components/common/Canvas/Decorations/FlyingRocks'
import Routes from '@/constants/enums/Routes'
import useSceneControls from '@/hooks/three/useSceneControls'
import useSectionProgress from '@/hooks/journey/useSectionProgress'
import ClassicCamera from '@/components/common/Canvas/ClassicCamera'
import Birds from './Birds/Birds'

const CairnsScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const { scene, animations } = useGLTF('/models/journey/chapter1.glb')

  const [
    camera,
    ground,
    flying_rocks,
    cairns,
    ark,
    background,
    rocks,
    trees,
    birds,
  ] = useMemo(
    () =>
      [
        'camera',
        'ground',
        'flying_rocks',
        'cairns',
        'ark',
        'background',
        'rocks',
        'trees',
        'birds',
      ].map((n) => scene.children.find((o) => o.name === n)),
    []
  )

  const localCamRef = useRef<THREE.PerspectiveCamera>()
  const containerRef = useRef<THREE.Group>()

  const isSettledInScene = useSceneStore(
    (s) => !s.inTransition && s.renderedScene === SceneName.Cairns
  )
  const [sequence, setSequence] = useState(0)
  const willPlay = useSceneStore((s) => s.nextScene === SceneName.Cairns)
  useSceneControls(SceneName.Cairns, Routes.Journey)

  const audio = useAudioManager(VOICEOVER.JOURNEY.CAIRNS)

  // Animation
  const { actions, mixer } = useAnimations(animations, containerRef)
  const anim = useAnimManager(actions, mixer, 'camera')
  useConfigActions(actions, 'camera')

  useEffect(() => {
    if (!willPlay) return
    anim.init()
    return anim.stop
  }, [willPlay])

  useSectionProgress(JourneySection.Cairns, [{ actions, name: 'camera' }, 5000])

  // Sequence
  useAsyncEffect(
    async (wrap) => {
      if (!isSettledInScene) return
      const { setSection } = useJourneyStore.getState()

      wait(24_000).then(() => setSequence(1))
      wait(25_300).then(() => setSequence(2))
      wait(28_000).then(() => setSequence(3))
      await wrap(Promise.all([anim.play(), audio.play()]))
      await wrap(wait(5000))

      setSection(JourneySection.Lake)
    },
    () => {
      audio.stop()
      setSequence(0)
    },
    [isSettledInScene]
  )

  useEffect(() => {
    ;((background.children[0] as THREE.Mesh)
      .material as THREE.MeshBasicMaterial).fog = false
  }, [])

  useMouseRotation(localCamRef, {
    offset: [-Math.PI / 2, 0, 0],
    amplitude: 0.2,
    easing: 0.01,
    enable: willPlay || isSettledInScene,
  })

  // useTraceRender({
  //   camera,
  //   ground,
  //   flying_rocks,
  //   cairns,
  //   ark,
  //   background,
  //   rocks,
  //   trees,
  //   birds,
  //   scene,
  //   animations,
  //   localCamRef,
  //   containerRef,
  //   isSettledInScene,
  //   willPlay,
  //   mixer,
  //   camRef,
  // })

  return (
    <>
      {/* <ClassicCamera ref={camRef} /> */}
      <group
        ref={containerRef}
        position={camera.position}
        quaternion={camera.quaternion}
      >
        <perspectiveCamera
          ref={mergeRefs([camRef, localCamRef])}
          rotation-x={-Math.PI / 2}
          near={0.1}
          far={1000}
          fov={54.9}
        />
      </group>

      <CustomSky />

      <FlyingRocks flyingRocks={flying_rocks} />

      <GroupShorthand object={cairns}>
        <GroupShorthand object={cairns.children[0]}>
          {cairns.children[0].children.map((child) => (
            <MeshShorthand object={child as THREE.Mesh} key={child.uuid} />
          ))}
        </GroupShorthand>
      </GroupShorthand>

      <GroupShorthand object={ark}>
        <MeshShorthand object={ark.children[0] as THREE.Mesh} />
      </GroupShorthand>

      <GroupShorthand object={background}>
        <MeshShorthand object={background.children[0] as THREE.Mesh} />
      </GroupShorthand>

      <GroupShorthand object={rocks}>
        <MeshShorthand object={rocks.children[0] as THREE.Mesh} />
      </GroupShorthand>

      <GroupShorthand object={trees}>
        <GroupShorthand object={trees.children[0] as THREE.Mesh}>
          {trees.children[0].children.map((tree) => (
            <TreeParams
              tree={tree as THREE.Mesh}
              key={tree.uuid}
              treeParams={{
                uWindNoiseSize: 2.5,
                uWindSpeed: 2.0,
                uWindAmplitude: 0.4,
              }}
              folderName={'cairns.greenery'}
              route={Routes.Journey}
            />
          ))}
        </GroupShorthand>
      </GroupShorthand>

      <CairnGround
        group={ground as THREE.Group}
        mesh={ground.children[0] as THREE.Mesh}
      />

      <Birds points={birds.children} sequence={sequence} />
    </>
  )
})

export default withScenePortal(React.memo(CairnsScene))
