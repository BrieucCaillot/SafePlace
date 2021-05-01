import { useEffect } from 'react'

import useAudioStore from '@/stores/useAudioStore'
import Place from '@/constants/enums/Place'
import AudioStatus from '@/constants/enums/Audio'
import { VoiceoverSafeplace } from '@/constants/enums/Voiceover'

import Arrived from '@/components/Safeplace/Arrived'
import Instructions from '@/components/Instructions/Instructions'

const OnBoarding = () => {
  return (
    <>
      <Arrived />
      <Instructions />
    </>
  )
}

export default OnBoarding
