import create from 'zustand'
import { Howl } from 'howler'

import Place from '@/constants/enums/Place'
import InstructionsList from '@/constants/enums/InstructionsList'
import VOICEOVER_SPRITE from '@/constants/VOICEOVER_SPRITE'
import AudioStatus from '@/constants/enums/Audio'
import Ambiants from '@/constants/enums/Ambiant'
import {
  VoiceoverJourney,
  VoiceoverSafeplace,
} from '@/constants/enums/Voiceover'

type AudioStore = {
  isAudioMuted: boolean
  setIsAudioMutued: (muted: boolean) => void

  // AMBIANT
  ambiantStatusMap: Map<Ambiants, AudioStatus>
  setAmbiantStatus: (key: Ambiants, status: AudioStatus) => void
  checkAmbiantStatus: (key: Ambiants, status: AudioStatus) => boolean
  currentAmbiant: {
    name: Ambiants | null
    ambiant: Howl | null
  }
  setCurrentAmbiant: (
    place: Place,
    ambiant: Ambiants
  ) => {
    name: Ambiants
    ambiant: Howl
  }
  isAmbiantPlayable: (key: Ambiants) => boolean

  // VOICEOVER
  voiceoverStatusMap: Map<
    VoiceoverSafeplace | InstructionsList | VoiceoverJourney,
    AudioStatus
  >
  setVoiceoverStatus: (
    key: VoiceoverSafeplace | InstructionsList | VoiceoverJourney,
    status: AudioStatus
  ) => void
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
  checkVoiceoverStatus: (
    key: VoiceoverSafeplace | InstructionsList | VoiceoverJourney,
    status: AudioStatus
  ) => boolean
  isVoiceoverPlayable: (
    key: VoiceoverSafeplace | InstructionsList | VoiceoverJourney
  ) => boolean
}

const useAudioStore = create<AudioStore>((set, get, state) => ({
  isAudioMuted: false,
  setIsAudioMutued: (muted) => {
    const { ambiant } = get().currentAmbiant
    const { voiceover } = get().currentVoiceover

    set({ isAudioMuted: muted })

    if (muted) {
      if (ambiant) ambiant.fade(ambiant.volume(), 0, 1000)
      if (voiceover) voiceover.fade(voiceover.volume(), 0, 1000)
    } else {
      if (ambiant) ambiant.fade(ambiant.volume(), 1, 1000)
      if (voiceover) voiceover.fade(voiceover.volume(), 1, 1000)
    }
  },
  // AMBIANT
  ambiantStatusMap: new Map(),
  setAmbiantStatus: (key, status) => {
    set({ ambiantStatusMap: get().ambiantStatusMap.set(key, status) })
  },
  checkAmbiantStatus: (key, ambiantStatus) =>
    get().ambiantStatusMap.get(key) === ambiantStatus,
  currentAmbiant: {
    name: null,
    ambiant: null,
  },
  isAmbiantPlayable: (key) =>
    !get().checkAmbiantStatus(key, AudioStatus.Playing) &&
    !get().checkAmbiantStatus(key, AudioStatus.Played),
  setCurrentAmbiant: (place, ambiants) => {
    const { ambiant } = get().currentAmbiant

    if (ambiant) ambiant.unload()

    const sound = new Howl({
      src: [`/audios/ambiants/${place}/${ambiants}.mp3`],
      volume: get().isAudioMuted ? 0 : 1,
      loop: true,
    })

    // Clear listener after first call.
    sound.once('load', function () {
      sound.play()
      get().setAmbiantStatus(ambiants, AudioStatus.Playing)
    })

    // Fires when the voiceover finishes playing.
    sound.on('end', function () {
      get().setAmbiantStatus(ambiants, AudioStatus.Played)
    })

    set({ currentAmbiant: { name: ambiants, ambiant: sound } })

    return get().currentAmbiant
  },

  // VOICEOVER
  voiceoverStatusMap: new Map(),
  setVoiceoverStatus: (key, status) => {
    set({ voiceoverStatusMap: get().voiceoverStatusMap.set(key, status) })
  },
  currentVoiceover: {
    name: null,
    voiceover: null,
  },
  setCurrentVoiceover: (place, voiceoverName) => {
    const { voiceover } = get().currentVoiceover

    if (voiceover) voiceover.unload()

    const sound = new Howl({
      src: [`/audios/voiceover/${place}/${voiceoverName}.mp3`],
      volume: get().isAudioMuted ? 0 : 1,
    })

    // Clear listener after first call.
    sound.once('load', function () {
      sound.play()
      get().setVoiceoverStatus(voiceoverName, AudioStatus.Playing)
    })

    // Fires when the voiceover finishes playing.
    sound.on('end', function () {
      get().setVoiceoverStatus(voiceoverName, AudioStatus.Played)
    })

    set({ currentVoiceover: { name: voiceoverName, voiceover: sound } })

    return get().currentVoiceover
  },
  checkVoiceoverStatus: (key, status) =>
    get().voiceoverStatusMap.get(key) === status,
  isVoiceoverPlayable: (key) =>
    !get().checkVoiceoverStatus(key, AudioStatus.Playing) &&
    !get().checkVoiceoverStatus(key, AudioStatus.Played),
}))

// window.useAudioStore = useAudioStore

export default useAudioStore
