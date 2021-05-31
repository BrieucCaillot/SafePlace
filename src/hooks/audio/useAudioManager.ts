import useAudioStore from '@/stores/useAudioStore'
import useUserStore from '@/stores/useUserStore'
import promisifyHowl from '@/utils/promise/promisifyHowl'
import { Howl } from 'howler'
import { useCallback, useEffect, useRef } from 'react'
import shallow from 'zustand/shallow'

const useAudioManager = (url: string | string[]) => {
  const currentSound = useRef<Howl>(null)

  const isPaused = useUserStore((s) => s.isPaused)

  useEffect(() => {
    if (currentSound.current === null) return
    if (isPaused) currentSound.current.pause()
    else currentSound.current.play()
  }, [isPaused])

  const sounds = useAudioStore(
    (s) =>
      typeof url === 'string'
        ? s.initAudio(url)
        : Object.fromEntries(url.map((url) => [url, s.initAudio(url)])),
    shallow
  )

  const play = useCallback(
    (u: string = null) => {
      if (!('pannerAttr' in sounds) && u === null)
        throw new Error('An url is required')
      const s = 'pannerAttr' in sounds ? (sounds as Howl) : sounds[u]
      currentSound.current = s
      if (!useUserStore.getState().isPaused) s.play()
      return promisifyHowl(s, 'end')
    },
    [sounds]
  )

  const stop = useCallback(() => {
    if (currentSound.current === null) return
    currentSound.current.stop()
    currentSound.current = null
  }, [sounds])

  return { play, stop }
}

export default useAudioManager
