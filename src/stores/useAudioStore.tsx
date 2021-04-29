import create from 'zustand'
import { Howl } from 'howler'
import { InstructionsList } from '@/components/Instructions/Instructions'
import { Place } from '@/stores/useSceneStore'

export enum VoiceoverSafeplace {
  Outside = 'Outside',
  OnBoarding = 'OnBoarding',
  Inside = 'Inside',
  MountainColumn = 'MountainColumn',
}

export enum VoiceoverJourney {
  One = 'One',
}

type AudioStore = {
  isAudioMuted: boolean
  setIsAudioMutued: (muted: boolean) => void
  isVoiceoverDone: boolean
  currentVoiceover: {
    name: VoiceoverSafeplace | InstructionsList | VoiceoverJourney | null
    voiceover: Howl | null
  }
  setCurrentVoiceover: (
    place: Place,
    voiceoverName: VoiceoverSafeplace | InstructionsList | VoiceoverJourney
  ) => {
    name: VoiceoverSafeplace | InstructionsList | VoiceoverJourney
    voiceover: Howl
  }
}

const useAudioStore = create<AudioStore>((set, get, state) => ({
  isAudioMuted: false,
  setIsAudioMutued: (muted) => {
    set({ isAudioMuted: muted })
    const { voiceover } = get().currentVoiceover
    if (muted) {
      voiceover.fade(voiceover.volume(), 0, 1000)
    } else {
      voiceover.fade(voiceover.volume(), 1, 1000)
    }
  },
  isVoiceoverDone: false,
  currentVoiceover: {
    name: null,
    voiceover: null,
  },
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

    // Fires when the voiceover finishes playing.
    sound.on('end', function () {
      set({ isVoiceoverDone: true })
    })

    set({ currentVoiceover: { name: voiceoverName, voiceover: sound } })

    return get().currentVoiceover
  },
}))

export default useAudioStore
