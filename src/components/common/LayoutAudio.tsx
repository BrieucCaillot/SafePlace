import { useEffect } from 'react'

import useAudioStore from '@/stores/useAudioStore'
import useUserStore from '@/stores/useUserStore'
import usePrevious from '@/hooks/usePrevious'
import Routes from '@/constants/enums/Routes'
import Place from '@/constants/enums/Place'
import { VoiceoverSafeplace } from '@/constants/enums/Voiceover'
import AudioStatus from '@/constants/enums/Audio'
import Ambiants from '@/constants/enums/Ambiant'

const LayoutAudio = (): null => {
  const isFirstConnection = useUserStore((s) => s.isFirstConnection)
  const isJourneyFinished = useUserStore((s) => s.isJourneyFinished)
  const isJourneyCompleted = useUserStore((s) => s.isJourneyCompleted)

  const { pathname } = useUserStore((s) => s.router)
  const previousPathname = usePrevious(pathname)

  useEffect(() => {
    const {
      currentAmbiant,
      setCurrentAmbiant,
      currentVoiceover: { voiceover },
      setCurrentVoiceover,
      setVoiceoverStatus,
    } = useAudioStore.getState()

    if (pathname === Routes.OnBoarding || pathname === Routes.Resources) {
      if (currentAmbiant.name === Ambiants.Safeplace) return
      setCurrentAmbiant(Place.Safeplace, Ambiants.Safeplace)
    }

    if (pathname === Routes.OnBoarding) {
      if (isFirstConnection) {
        setCurrentVoiceover(Place.Safeplace, VoiceoverSafeplace.Arrived)
      } else {
        setVoiceoverStatus(VoiceoverSafeplace.Arrived, AudioStatus.Played)
      }
    }

    if (previousPathname === Routes.Journey) {
      if (!voiceover) return
      voiceover.fade(voiceover.volume(), 0, 1000)

      if (pathname === Routes.Resources) {
        if (isJourneyCompleted && !isJourneyFinished) return
        setCurrentVoiceover(Place.Safeplace, VoiceoverSafeplace.BackFromJourney)
      }
    }
  }, [pathname, isFirstConnection, isJourneyFinished])

  return null
}

export default LayoutAudio
