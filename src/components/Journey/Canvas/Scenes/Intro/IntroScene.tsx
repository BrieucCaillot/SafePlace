import React, { forwardRef, RefObject, useEffect } from 'react'

import useJourneyStore from '@/stores/useJourneyStore'
import useAudioStore from '@/stores/useAudioStore'
import JourneySection from '@/constants/enums/JourneySection'
import Place from '@/constants/enums/Place'
import Ambiants from '@/constants/enums/Ambiant'
import { VoiceoverJourney } from '@/constants/enums/Voiceover'

import ClassicCamera from '@/components/common/Canvas/ClassicCamera'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import CustomSky from '@/components/canvas/Sky/CustomSky'
import AudioStatus from '@/constants/enums/Audio'

const IntroScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const isIntroSection = useJourneyStore(
    (s) => s.currentSection === JourneySection.Intro
  )
  const isVoiceoverFinished = useAudioStore((s) =>
    s.checkVoiceoverStatus(VoiceoverJourney.Intro, AudioStatus.Played)
  )

  useEffect(() => {
    if (!isIntroSection) return
    const { setCurrentAmbiant, setCurrentVoiceover } = useAudioStore.getState()
    // Ambiant
    setCurrentAmbiant(Place.Journey, Ambiants.Intro)
    // Voiceover
    setCurrentVoiceover(Place.Journey, VoiceoverJourney.Intro)
  }, [isIntroSection])

  useEffect(() => {
    if (isVoiceoverFinished)
      useJourneyStore.getState().setSection(JourneySection.Cairns)
  }, [isVoiceoverFinished])

  return (
    <>
      <ClassicCamera ref={camRef} />
      <CustomSky />
      <mesh rotation={[Math.PI / 2, Math.PI / 2, 0]}>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  )
})

export default withScenePortal(IntroScene)
