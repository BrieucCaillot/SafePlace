import { useEffect } from 'react'

import useUserStore from '@/stores/useUserStore'
import useAudioStore from '@/stores/useAudioStore'
import { VoiceoverSafeplace } from '@/constants/enums/Voiceover'
import AudioStatus from '@/constants/enums/Audio'
import AnimationStatus from '@/constants/enums/AnimationStatus'

import Instructions from '@/components/Instructions/Instructions'

const OnBoarding = () => {
  const reverseCompletedCloudsTransition = useUserStore(
    (s) => s.cloudsTransitionStatus === AnimationStatus.ReverseCompleted
  )

  const isVoiceoverSafeplaceArrivedPlayed = useAudioStore((s) =>
    s.checkVoiceoverStatus(VoiceoverSafeplace.Arrived, AudioStatus.Played)
  )

  return (
    <>
      {reverseCompletedCloudsTransition &&
        isVoiceoverSafeplaceArrivedPlayed && <Instructions />}
    </>
  )
}

export default OnBoarding
