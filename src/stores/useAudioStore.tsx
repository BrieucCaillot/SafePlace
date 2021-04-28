import create from 'zustand'
import { Howl } from 'howler'
import { InstructionsList } from '@/components/Instructions/Instructions'
import { Place } from '@/stores/useSceneStore'

export enum VoiceoverSafeplace {
  Outside = 'Outside',
  OnBoarding = 'OnBoarding',
  Inside = 'Inside',
}

export enum VoiceoverJourney {
  One = 'One',
}

type AudioStore = {
  isAudioMuted: boolean
  setIsAudioMutued: (muted: boolean) => void
  isVoiceoverDone: boolean
  currentVoiceover: Howl | null
  setCurrentVoiceover: (
    place: Place,
    voiceoverName: VoiceoverSafeplace | InstructionsList | VoiceoverJourney
  ) => Howl
}

const useAudioStore = create<AudioStore>((set, get, state) => ({
  isAudioMuted: false,
  setIsAudioMutued: (muted) => {
    set({ isAudioMuted: muted })
    if (muted) {
      get().currentVoiceover.fade(get().currentVoiceover.volume(), 0, 1000)
    } else {
      get().currentVoiceover.fade(get().currentVoiceover.volume(), 1, 1000)
    }
  },
  isVoiceoverDone: false,
  currentVoiceover: null,
  setCurrentVoiceover: (place, voiceoverName) => {
    set({ isVoiceoverDone: false })

    const sound = new Howl({
      src: [`/audios/voiceover/${place}/${voiceoverName}.mp3`],
      volume: get().isAudioMuted ? 0 : 1,
    })

    // Clear listener after first call.
    sound.once('load', function () {
      sound.play()
    })

    // Fires when the sound finishes playing.
    sound.on('end', function () {
      console.log('Finished!')
      set({ isVoiceoverDone: true })
    })

    set({ currentVoiceover: sound })

    return sound
  },
}))

export default useAudioStore
