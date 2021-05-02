import React, { forwardRef, RefObject, useEffect } from 'react'

import useJourneyStore from '@/stores/useJourneyStore'
import useAudioStore from '@/stores/useAudioStore'
import JourneySection from '@/constants/enums/JourneySection'
import Place from '@/constants/enums/Place'
import { VoiceoverJourney } from '@/constants/enums/Voiceover'

import ClassicCamera from '@/components/common/Canvas/ClassicCamera'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import JourneySky from '@/components/Journey/Canvas/Decorations/JourneySky'

const IntroScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const isIntroSection = useJourneyStore(
    (s) => s.currentSection === JourneySection.Intro
  )

  /**
   * Voiceover
   */
  const setCurrentVoiceover = useAudioStore(
    (state) => state.setCurrentVoiceover
  )

  useEffect(() => {
    if (!isIntroSection) return
    setCurrentVoiceover(Place.Journey, VoiceoverJourney.Intro)
  }, [isIntroSection])

  return (
    <>
      <ClassicCamera ref={camRef} />
      <JourneySky />
      <mesh rotation={[Math.PI / 2, Math.PI / 2, 0]}>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  )
})

export default withScenePortal(IntroScene)
