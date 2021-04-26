import { ReactNode, useEffect } from 'react'
import { Howl, Howler } from 'howler'

import useAudioStore, { VoiceoverSafeplace } from '@/stores/useVoiceoverStore'
import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'

const LayoutSoundManager = (): ReactNode => {
  const currentPOI = useSafeplaceStore((state) => state.currentPOI)

  const voiceoverSafeplace = useAudioStore((state) => state.voiceoverSafeplace)
  const setVoiceoverSafeplaceSrc = useAudioStore(
    (state) => state.setVoiceoverSafeplaceSrc
  )

  useEffect(() => {
    switch (currentPOI) {
      case SafeplacePOI.OnBoarding:
        // setVoiceoverSafeplaceSrc(VoiceoverSafeplace.Arrived)
        // voiceoverSafeplace.play()
        break
      case SafeplacePOI.Inside:
        // setVoiceoverSafeplaceSrc(VoiceoverSafeplace.Inside)
        // voiceoverSafeplace.play()
        break
    }
    // voiceover.play()
  }, [currentPOI])

  return null
}

export default LayoutSoundManager
