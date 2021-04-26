import create from 'zustand'
import { Howl } from 'howler'

// Moutain sections
export enum VoiceoverSafeplace {
  Arrived = 'safeplace_arrived',
  Inside = 'safeplace_inside',
}

type VoiceoverStore = {
  voiceoverSafeplaceSrc: VoiceoverSafeplace
  setVoiceoverSafeplaceSrc: (voiceoverSafeplace: VoiceoverSafeplace) => void
  voiceoverSafeplace: Howl
  voiceoverJourney: Howl
  voiceoverIsMuted: boolean
}

const useVoiceoverStore = create<VoiceoverStore>((set, get, state) => ({
  voiceoverSafeplaceSrc: VoiceoverSafeplace.Arrived,
  setVoiceoverSafeplaceSrc: (voiceover: VoiceoverSafeplace) =>
    set({ voiceoverSafeplaceSrc: voiceover }),
  voiceoverSafeplace: new Howl({
    src: [`/audios/voiceover/safeplace/${VoiceoverSafeplace.Arrived}.mp3`],
  }),
  voiceoverJourney: new Howl({
    src: [
      '/audios/voiceover/journey/mountain_journey_1.mp3',
      '/audios/voiceover/journey/mountain_journey_2.mp3',
      '/audios/voiceover/journey/mountain_journey_3.mp3',
      '/audios/voiceover/journey/mountain_journey_4.mp3',
      '/audios/voiceover/journey/mountain_journey_5.mp3',
    ],
  }),
  voiceoverIsMuted: false,
}))

export default useVoiceoverStore
