import { useEffect } from 'react'

import useAudioStore from '@/stores/useAudioStore'
import useUserStore from '@/stores/useUserStore'

import Place from '@/constants/enums/Place'
import { VoiceoverSafeplace } from '@/constants/enums/Voiceover'
import AudioStatus from '@/constants/enums/Audio'
import Ambiants from '@/constants/enums/Ambiant'

const Arrived = (): null => {
  const isFirstConnection = useUserStore((s) => s.isFirstConnection)

  const setCurrentAmbiant = useAudioStore((state) => state.setCurrentAmbiant)

  const setCurrentVoiceover = useAudioStore((s) => s.setCurrentVoiceover)
  const isVoiceoverSafeplaceArrivedPlayed = useAudioStore((s) =>
    s.checkVoiceoverStatus(VoiceoverSafeplace.Arrived, AudioStatus.Played)
  )
  const setVoiceoverStatus = useAudioStore((s) => s.setVoiceoverStatus)

  useEffect(() => {
    setCurrentAmbiant(Place.Safeplace, Ambiants.Safeplace)
  }, [])

  useEffect(() => {
    if (isFirstConnection == 'true') {
      setCurrentVoiceover(Place.Safeplace, VoiceoverSafeplace.Arrived)
    } else {
      setVoiceoverStatus(VoiceoverSafeplace.Arrived, AudioStatus.Played)
    }
  }, [isFirstConnection])

  return null
}

export default Arrived
