import create from 'zustand'
import { Howl } from 'howler'

import SCENES_AMBIANTS from '@/constants/SCENES_AMBIANT'
import SceneName from '@/constants/enums/SceneName'
import promisifyHowl from '@/utils/promise/promisifyHowl'

type AudioStore = {
  ambiantHowlMap: Map<SceneName, Howl>
  onceAudioMap: Map<string, Howl>
  play: (url: string) => Promise<void>
  stop: (url: string) => void
}

const useAudioStore = create<AudioStore>((set, get) => ({
  ambiantHowlMap: new Map<SceneName, Howl>(
    Object.entries(SCENES_AMBIANTS).map(([sceneName, url]) => [
      sceneName as SceneName,
      new Howl({ src: [url], loop: true }),
    ])
  ),
  onceAudioMap: new Map<string, Howl>(),
  play: (url: string) => {
    const { onceAudioMap } = get()
    let howl = onceAudioMap.get(url)

    if (howl === undefined) {
      howl = new Howl({ src: [url], rate: 4 /* DEBUG */ })
      onceAudioMap.set(url, howl)
      set({ onceAudioMap })
    }

    howl.play()
    return promisifyHowl(howl, 'end')
  },
  stop: (url: string) => {
    const { onceAudioMap } = get()
    let howl = onceAudioMap.get(url)
    if (howl === undefined) return
    howl.stop()
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
