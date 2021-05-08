import { useEffect } from 'react'

import useAudioStore from '@/stores/useAudioStore'
import useUserStore from '@/stores/useUserStore'

import Routes from '@/constants/enums/Routes'
import Place from '@/constants/enums/Place'
import { VoiceoverSafeplace } from '@/constants/enums/Voiceover'
import AudioStatus from '@/constants/enums/Audio'
import Ambiants from '@/constants/enums/Ambiant'
import usePrevious from '@/hooks/usePrevious'

const LayoutAudio = (): null => {
  const isFirstConnection = useUserStore((s) => s.isFirstConnection)

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
    }
  }, [pathname, isFirstConnection])

  return null
}

export default LayoutAudio
