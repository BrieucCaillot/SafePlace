import create from 'zustand'
import { Howl } from 'howler'
import { SafeplacePOI } from './useSafeplaceStore'

type VoiceoverStore = {
  voiceoverSafeplaceMap: Map<SafeplacePOI, Howl>
  getVoiceoverSafeplace: (key: SafeplacePOI) => Howl | null
}

const useVoiceoverStore = create<VoiceoverStore>((set, get, state) => ({
  voiceoverSafeplaceMap: new Map([
    [
      SafeplacePOI.OnBoarding,
      new Howl({ src: ['/audios/voiceover/safeplace/safeplace_arrived.mp3'] }),
    ],
    [
      SafeplacePOI.Inside,
      new Howl({ src: ['/audios/voiceover/safeplace/safeplace_inside.mp3'] }),
    ],
  ]),
  getVoiceoverSafeplace: (key: SafeplacePOI) =>
    get().voiceoverSafeplaceMap.get(key),
}))

export default useVoiceoverStore
