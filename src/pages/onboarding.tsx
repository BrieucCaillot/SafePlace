import useAudioStore from '@/stores/useAudioStore'
import { VoiceoverSafeplace } from '@/constants/enums/Voiceover'
import AudioStatus from '@/constants/enums/Audio'

import Instructions from '@/components/Instructions/Instructions'

const OnBoarding = () => {
  const isVoiceoverSafeplaceArrivedPlayed = useAudioStore((s) =>
    s.checkVoiceoverStatus(VoiceoverSafeplace.Arrived, AudioStatus.Played)
  )

  return <>{isVoiceoverSafeplaceArrivedPlayed && <Instructions />}</>
}

export default OnBoarding
