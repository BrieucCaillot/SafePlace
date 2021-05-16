import { useEffect } from 'react'

import useAudioStore from '@/stores/useAudioStore'
import useUserStore from '@/stores/useUserStore'
import usePrevious from '@/hooks/usePrevious'
import Routes from '@/constants/enums/Routes'
import Place from '@/constants/enums/Place'
import { VoiceoverSafeplace } from '@/constants/enums/Voiceover'
import AudioStatus from '@/constants/enums/Audio'
import Ambiants from '@/constants/enums/Ambiant'
import AnimationStatus from '@/constants/enums/AnimationStatus'

const LayoutAudio = (): null => {
  const isFirstConnection = useUserStore((s) => s.isFirstConnection)

  const { pathname } = useUserStore((s) => s.router)
  const previousPathname = usePrevious(pathname)
  const reverseCompletedCloudsTransition = useUserStore(
    (s) => s.cloudsTransitionStatus === AnimationStatus.ReverseCompleted
  )

  useEffect(() => {
    const {
      currentAmbiant,
      setCurrentAmbiant,
      currentVoiceover: { voiceover },
      setCurrentVoiceover,
      setVoiceoverStatus,
    } = useAudioStore.getState()

    if (
      [Routes.OnBoarding, Routes.Safeplace, Routes.Resources].includes(
        pathname as Routes
      )
    ) {
      if (
        currentAmbiant.name === Ambiants.Safeplace ||
        !reverseCompletedCloudsTransition
      )
        return
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
  }, [pathname, isFirstConnection, reverseCompletedCloudsTransition])

  return null
}

export default LayoutAudio
