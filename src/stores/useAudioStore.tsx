import create from 'zustand'
import { Howl } from 'howler'

import Place from '@/constants/enums/Place'
import InstructionsList from '@/constants/enums/InstructionsList'
import AudioStatus from '@/constants/enums/Audio'
import Ambiants from '@/constants/enums/Ambiant'
import {
  VoiceoverJourney,
  VoiceoverSafeplace,
} from '@/constants/enums/Voiceover'

type AudioKey = VoiceoverSafeplace | InstructionsList | VoiceoverJourney

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
  voiceoverStatusMap: Map<AudioKey, AudioStatus>
  setVoiceoverStatus: (key: AudioKey, status: AudioStatus) => void
  currentVoiceover: {
    name: AudioKey | null
    voiceover: Howl | null
  }
  setCurrentVoiceover: (
    place: Place,
    voiceoverName: AudioKey
  ) => {
    name: AudioKey
    voiceover: Howl
  }
  checkVoiceoverStatus: (key: AudioKey, status: AudioStatus) => boolean
  isVoiceoverPlayable: (key: AudioKey) => boolean
}

const useAudioStore = create<AudioStore>((set, get, state) => ({
  isAudioMuted: false,
  setIsAudioMutued: (muted) => {
    const {
      currentAmbiant: { ambiant },
      currentVoiceover: { voiceover },
    } = get()

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
    const {
      currentAmbiant: { ambiant },
      isAudioMuted,
      setAmbiantStatus,
    } = get()

    if (ambiant) ambiant.unload()

    const sound = new Howl({
      src: [`/audios/ambiants/${place}/${ambiants}.mp3`],
      volume: isAudioMuted ? 0 : 1,
      loop: true,
    })

    // Clear listener after first call.
    sound.once('load', function () {
      sound.play()
      setAmbiantStatus(ambiants, AudioStatus.Playing)
    })

    // Fires when the voiceover finishes playing.
    sound.on('end', function () {
      setAmbiantStatus(ambiants, AudioStatus.Played)
    })

    const currentAmbiant = { name: ambiants, ambiant: sound }
    set({ currentAmbiant })

    return currentAmbiant
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
    const {
      currentVoiceover: { voiceover },
      isAudioMuted,
      setVoiceoverStatus,
    } = get()

    if (voiceover) voiceover.unload()

    const sound = new Howl({
      src: [`/audios/voiceover/${place}/${voiceoverName}.mp3`],
      volume: isAudioMuted ? 0 : 1,
    })

    // Clear listener after first call.
    sound.once('load', function () {
      sound.play()
      setVoiceoverStatus(voiceoverName, AudioStatus.Playing)
    })

    // Fires when the voiceover finishes playing.
    sound.on('end', function () {
      setVoiceoverStatus(voiceoverName, AudioStatus.Played)
    })

    const currentVoiceover = { name: voiceoverName, voiceover: sound }
    set({ currentVoiceover })

    return currentVoiceover
  },
  checkVoiceoverStatus: (key, status) =>
    get().voiceoverStatusMap.get(key) === status,
  isVoiceoverPlayable: (key) =>
    !get().checkVoiceoverStatus(key, AudioStatus.Playing) &&
    !get().checkVoiceoverStatus(key, AudioStatus.Played),
}))

// const HELPER_OBJECT = {
//   checkVoiceoverStatus: (s: AudioStore, key: AudioKey, status: AudioStatus) =>
//     s.voiceoverStatusMap.get(key) === status,
//   isVoiceoverPlayable: (s: AudioStore, key: AudioKey) =>
//     !s.checkVoiceoverStatus(key, AudioStatus.Playing) &&
//     !s.checkVoiceoverStatus(key, AudioStatus.Played),
// }

// window.useAudioStore = useAudioStore

export default useAudioStore
