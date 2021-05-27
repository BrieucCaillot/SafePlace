import React, { forwardRef, RefObject } from 'react'
import * as THREE from 'three'

import ClassicCamera from '@/components/common/Canvas/ClassicCamera'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import CustomSky from '@/components/canvas/Sky/CustomSky'
import useSceneStore from '@/stores/useSceneStore'
import SceneName from '@/constants/enums/SceneName'
import MountainPlane from './MountainPlane'
import useAsyncEffect from '@/hooks/promise/useAsyncEffect'
import useAudioStore from '@/stores/useAudioStore'
import VOICEOVER from '@/constants/VOICEOVER'
import useJourneyStore from '@/stores/useJourneyStore'
import JourneySection from '@/constants/enums/JourneySection'

const IntroScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const isSettledInScene = useSceneStore(
    (s) => !s.inTransition && s.renderedScene === SceneName.JourneyIntro
  )

  useAsyncEffect(
    async (wrap) => {
      if (!isSettledInScene) return
      const { play } = useAudioStore.getState()
      const { setSection } = useJourneyStore.getState()

      await wrap(play(VOICEOVER.JOURNEY.INTRO))
      setSection(JourneySection.Cairns)
    },
    () => {},
    [isSettledInScene]
  )

  return (
    <>
      <ClassicCamera ref={camRef} />
      <CustomSky />
      <MountainPlane />
    </>
  )
})

export default withScenePortal(IntroScene)
