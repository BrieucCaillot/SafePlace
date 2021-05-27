import useAudioStore from '@/stores/useAudioStore'
import { useEffect } from 'react'
import useDropPromise from '../promise/useDropPromise'

const usePlayAudio = (
  url: string,
  shouldPlay: boolean,
  onAudioEnd: () => void = () => {}
) => {
  const { wrap, drop } = useDropPromise()

  useEffect(() => {
    if (!shouldPlay) return
    const { play, stop } = useAudioStore.getState()
    wrap(play(url)).then(onAudioEnd)

    return () => {
      drop()
      stop(url)
    }
  }, [url, shouldPlay])
}

export default usePlayAudio
