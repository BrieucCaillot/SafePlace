import { useEffect } from 'react'
import { NextRouter } from 'next/router'

import useAudioStore from '@/stores/useAudioStore'
import useUserStore from '@/stores/useUserStore'

import Place from '@/constants/enums/Place'
import { VoiceoverSafeplace } from '@/constants/enums/Voiceover'
import AudioStatus from '@/constants/enums/Audio'
import Ambiants from '@/constants/enums/Ambiant'
import usePrevious from '@/hooks/usePrevious'

const SafeplaceAudio = (): null => {
  const isFirstConnection = useUserStore((s) => s.isFirstConnection)

  const { pathname } = useUserStore((s) => s.router)
  const previousPathname = usePrevious(pathname)

  const setCurrentAmbiant = useAudioStore((s) => s.setCurrentAmbiant)
  const { voiceover } = useAudioStore((s) => s.currentVoiceover)
  const setCurrentVoiceover = useAudioStore((s) => s.setCurrentVoiceover)
  const setVoiceoverStatus = useAudioStore((s) => s.setVoiceoverStatus)

  useEffect(() => {
    if (previousPathname === '/' || previousPathname === '/journey') {
      // Ambiant
      setCurrentAmbiant(Place.Safeplace, Ambiants.Safeplace)
      // Voiceover
      if (!voiceover) return
      voiceover.fade(voiceover.volume(), 0, 1000)
    }
  }, [pathname])

  useEffect(() => {
    if (pathname !== '/onboarding') return
    if (isFirstConnection) {
      setCurrentVoiceover(Place.Safeplace, VoiceoverSafeplace.Arrived)
    } else {
      setVoiceoverStatus(VoiceoverSafeplace.Arrived, AudioStatus.Played)
    }
  }, [pathname, isFirstConnection])

  return null
}

export default SafeplaceAudio
