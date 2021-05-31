import React, { forwardRef, RefObject } from 'react'
import * as THREE from 'three'
import { useControls } from 'leva'

import useSceneStore from '@/stores/useSceneStore'
import useJourneyStore from '@/stores/useJourneyStore'
import useAsyncEffect from '@/hooks/promise/useAsyncEffect'
import SceneName from '@/constants/enums/SceneName'
import VOICEOVER from '@/constants/VOICEOVER'
import JourneySection from '@/constants/enums/JourneySection'

import ClassicCamera from '@/components/common/Canvas/ClassicCamera'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import CustomSky from '@/components/canvas/Sky/CustomSky'
import MountainPlane from '@/components/Journey/Canvas/Scenes/Intro/Mountain/MountainPlane'
import CloudPlane from '@/components/Journey/Canvas/Scenes/Intro/Clouds/CloudPlane'
import FogPlane from '@/components/Journey/Canvas/Scenes/Intro/Fog/FogPlane'
import useAudioManager from '@/hooks/audio/useAudioManager'

const IntroScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const isSettledInScene = useSceneStore(
    (s) => !s.inTransition && s.renderedScene === SceneName.JourneyIntro
  )

  const {
    displacementEasing,
    displacementAmount,
    cloud1Speed,
    cloud2Speed,
    fogSpeed,
    fogSize,
  } = useControls(
    'intro',
    {
      displacementEasing: { min: 0, max: 1, value: 0.05 },
      displacementAmount: {
        value: 0.01,
        min: 0,
        max: 0.03,
        step: 0.001,
      },
      cloud1Speed: { min: 0, max: 0.05, value: 0.02 },
      cloud2Speed: { min: 0, max: 0.05, value: 0.02 },
      fogSpeed: { min: 0, max: 0.5, value: 0.09 },
      fogSize: [1, 1.1, 1],
    },
    {
      collapsed: true,
    }
  )

  const audio = useAudioManager(VOICEOVER.JOURNEY.INTRO)

  useAsyncEffect(
    async (wrap) => {
      if (!isSettledInScene) return
      const { setSection } = useJourneyStore.getState()

      await wrap(audio.play())
      setSection(JourneySection.Cairns)
    },
    () => audio.stop(),
    [isSettledInScene]
  )

  return (
    <>
      <ClassicCamera ref={camRef} />
      <CustomSky />
      <MountainPlane
        displacement={displacementAmount}
        easing={displacementEasing}
      />
      <CloudPlane
        url='/img/journey/intro/clouds_1.png'
        scrollSpeed={cloud1Speed}
      />
      <CloudPlane
        url='/img/journey/intro/clouds_2.png'
        scrollSpeed={cloud2Speed}
      />
      <FogPlane speed={fogSpeed} size={fogSize} />
    </>
  )
})

export default withScenePortal(IntroScene)
