import create from 'zustand'
import { Howl } from 'howler'
import Place from '@/constants/enums/Place'
import InstructionsList from '@/constants/enums/InstructionsList'

export enum VoiceoverSafeplace {
  Outside = 'Outside',
  OnBoarding = 'OnBoarding',
  Inside = 'Inside',
  MountainColumn = 'MountainColumn',
}

export enum VoiceoverJourney {
  One = 'One',
}

export enum VoiceoverStatus {
  Processing = 'Processing',
  Playing = 'Playing',
  Played = 'Played',
}

type AudioStore = {
  isAudioMuted: boolean
  setIsAudioMutued: (muted: boolean) => void
  voiceoverStatusMap: Map<
    VoiceoverSafeplace | InstructionsList | VoiceoverJourney,
    VoiceoverStatus
  >
  setVoiceoverStatus: (
    key: VoiceoverSafeplace | InstructionsList | VoiceoverJourney,
    status: VoiceoverStatus
  ) => void
  isVoiceoverProcessing: (
    key: VoiceoverSafeplace | InstructionsList | VoiceoverJourney
  ) => boolean
  isVoiceoverPlayed: (
    key: VoiceoverSafeplace | InstructionsList | VoiceoverJourney
  ) => boolean
  isVoiceoverPlaying: (
    key: VoiceoverSafeplace | InstructionsList | VoiceoverJourney
  ) => boolean
  // isVoiceoverPlayable: (
  //   key: VoiceoverSafeplace | InstructionsList | VoiceoverJourney
  // ) => boolean
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
  voiceoverStatusMap: new Map(),
  setVoiceoverStatus: (key, status) => {
    set({ voiceoverStatusMap: get().voiceoverStatusMap.set(key, status) })
  },
  isVoiceoverProcessing: (key) =>
    get().voiceoverStatusMap.get(key) == VoiceoverStatus.Processing,
  isVoiceoverPlayed: (key) =>
    get().voiceoverStatusMap.get(key) == VoiceoverStatus.Played,
  isVoiceoverPlaying: (key) =>
    get().voiceoverStatusMap.get(key) == VoiceoverStatus.Playing,
  // isVoiceoverPlayable: (key) =>
  //   !get().isVoiceoverProcessing(key) &&
  //   !get().isVoiceoverPlaying(key) &&
  //   !get().isVoiceoverPlayed(key),
  currentVoiceover: {
    name: null,
    voiceover: null,
  },
  setCurrentVoiceover: (place, voiceoverName) => {
    get().setVoiceoverStatus(voiceoverName, VoiceoverStatus.Processing)

    const sound = new Howl({
      src: [`/audios/voiceover/${place}/${voiceoverName}.mp3`],
      volume: get().isAudioMuted ? 0 : 1,
    })

    // Clear listener after first call.
    sound.once('load', function () {
      sound.play()
      get().setVoiceoverStatus(voiceoverName, VoiceoverStatus.Playing)
    })

    // Fires when the voiceover finishes playing.
    sound.on('end', function () {
      get().setVoiceoverStatus(voiceoverName, VoiceoverStatus.Played)
    })

    set({ currentVoiceover: { name: voiceoverName, voiceover: sound } })

    return get().currentVoiceover
  },
}))

// window.useAudioStore = useAudioStore

export default useAudioStore
