import { ReactNode, useEffect } from 'react'
import { Howl, Howler } from 'howler'

import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import useVoiceoverStore from '@/stores/useVoiceoverStore'

const SafeplaceVoiceover = (): null => {
  const getVoiceoverSafeplace = useVoiceoverStore(
    (state) => state.getVoiceoverSafeplace
  )
  const currentPOI = useSafeplaceStore((state) => state.currentPOI)
  const isCameraTravelling = useSafeplaceStore(
    (state) => state.isCameraTravelling
  )

  useEffect(() => {
    if (!isCameraTravelling) {
      if (currentPOI == SafeplacePOI.OnBoarding) {
        console.log('OnBoarding && DONE TRAVELING ')
      }
      if (currentPOI == SafeplacePOI.Inside) {
        getVoiceoverSafeplace(SafeplacePOI.Inside).play()
      }
    }
  }, [currentPOI, isCameraTravelling])

  return null
}

export default SafeplaceVoiceover
