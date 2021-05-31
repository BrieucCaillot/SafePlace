import create from 'zustand'
import { Howl } from 'howler'

import SCENES_AMBIANTS from '@/constants/SCENES_AMBIANT'
import SceneName from '@/constants/enums/SceneName'
import promisifyHowl from '@/utils/promise/promisifyHowl'

type AudioStore = {
  ambiantHowlMap: Map<SceneName, Howl>
  onceAudioMap: Map<string, Howl>
  initAudio: (url: string) => Howl
}

const useAudioStore = create<AudioStore>((set, get) => ({
  ambiantHowlMap: new Map<SceneName, Howl>(
    Object.entries(SCENES_AMBIANTS).map(([sceneName, url]) => [
      sceneName as SceneName,
      new Howl({ src: [url], loop: true }),
    ])
  ),
  onceAudioMap: new Map<string, Howl>(),
  initAudio: (url: string) => {
    const { onceAudioMap } = get()

    let howl = onceAudioMap.get(url)
    if (howl !== undefined) return howl

    howl = new Howl({ src: [url], rate: 1 /* DEBUG */ })
    onceAudioMap.set(url, howl)
    set({ onceAudioMap })

    return howl
  },
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
