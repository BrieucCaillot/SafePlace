import React, { forwardRef, RefObject, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useAnimations, useGLTF } from '@react-three/drei'
import mergeRefs from 'react-merge-refs'

import promisifyAction from '@/utils/promise/promisifyAction'

import useJourneyStore from '@/stores/useJourneyStore'
import useAudioStore from '@/stores/useAudioStore'
import useSceneStore from '@/stores/useSceneStore'

import useMouseRotation from '@/hooks/animation/useMouseRotation'
import useAsyncEffect from '@/hooks/promise/useAsyncEffect'

import withScenePortal from '@/components/common/Scenes/withScenePortal'
import CustomSky from '@/components/canvas/Sky/CustomSky'
import SceneShorthand from '@/components/common/Canvas/SceneShorthand'

import SceneName from '@/constants/enums/SceneName'
import JourneySection from '@/constants/enums/JourneySection'
import VOICEOVER from '@/constants/VOICEOVER'

import CairnGround from './CairnGround'
import wait from '@/utils/promise/wait'
import useConfigActions from '@/hooks/animation/useConfigActions'
import useSetActionDurationFromAudioDuration from '@/hooks/animation/useSetActionDurationFromAudioDuration'
import useAnimManager from '@/hooks/animation/useAnimManager'
import useAudioManager from '@/hooks/audio/useAudioManager'

const CairnsScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const {
    scene,
    animations: [camAnim],
    nodes,
  } = useGLTF('/models/journey/chapter1.glb')
  const cameraGroup = useMemo(() => scene.getObjectByName('camera'), [])

  const localCamRef = useRef<THREE.Camera>()
  const containerRef = useRef<THREE.Group>()

  const isSettledInScene = useSceneStore(
    (s) => !s.inTransition && s.renderedScene === SceneName.Cairns
  )
  const willPlay = useSceneStore((s) => s.nextScene === SceneName.Cairns)

  const audio = useAudioManager(VOICEOVER.JOURNEY.CAIRNS)

  // Animation
  const { actions, mixer } = useAnimations([camAnim], containerRef)
  const anim = useAnimManager(actions, mixer, 'Action.003')
  useConfigActions(actions, 'Action.003')

  useEffect(() => {
    if (!willPlay) return
    anim.init()
    return anim.stop
  }, [willPlay])

  // Sequence
  useAsyncEffect(
    async (wrap) => {
      if (!isSettledInScene) return
      const { setSection } = useJourneyStore.getState()

      await wrap(Promise.all([anim.play(), audio.play()]))
      await wrap(wait(5000))

      setSection(JourneySection.Lake)
    },
    () => audio.stop(),
    [isSettledInScene]
  )

  useMouseRotation(localCamRef, {
    offset: [-Math.PI / 2, 0, 0],
    amplitude: 0.2,
    easing: 0.01,
  })

  return (
    <>
      {/* <ClassicCamera ref={camRef} /> */}
      <group
        ref={containerRef}
        position={cameraGroup.position}
        quaternion={cameraGroup.quaternion}
      >
        <perspectiveCamera
          ref={mergeRefs([camRef, localCamRef])}
          near={0.1}
          far={1000}
          fov={54.9}
        />
      </group>
      <CustomSky />
      {/* <primitive object={scene} /> */}

      <SceneShorthand object={scene} />

      <CairnGround
        group={scene.children.find((o) => o.name === 'ground') as THREE.Group}
        mesh={nodes['ground_mesh'] as THREE.Mesh}
      />
    </>
  )
})

export default withScenePortal(CairnsScene)
