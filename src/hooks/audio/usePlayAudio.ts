import useAudioStore from '@/stores/useAudioStore'
import { useEffect } from 'react'
import useDropPromise from '../promise/useDropPromise'
import useAudioManager from './useAudioManager'

const usePlayAudio = (
  url: string,
  shouldPlay: boolean,
  onAudioEnd: () => void = () => {}
) => {
  const { wrap, drop } = useDropPromise()
  const audio = useAudioManager(url)

  useEffect(() => {
    if (!shouldPlay) return
    wrap(audio.play()).then(onAudioEnd)

    return () => {
      drop()
      audio.stop()
    }
  }, [url, shouldPlay])
}

export default usePlayAudio
