import useAudioStore from '@/stores/useAudioStore'
import { useEffect } from 'react'

// Copy audio duration to action duration
const useSetActionDurationFromAudioDuration = (
  actions: Record<string, THREE.AnimationAction>,
  name: string,
  voiceoverUrl: string
) => {
  useEffect(() => {
    const action = actions[name]
    const { initAudio } = useAudioStore.getState()

    const voiceover = initAudio(voiceoverUrl)
    const onLoad = () => action.setDuration(voiceover.duration())

    if (voiceover.state() !== 'loaded') {
      voiceover.on('load', onLoad)
      return () => void voiceover.off('load', onLoad)
    }
    onLoad()
  }, [])
}

export default useSetActionDurationFromAudioDuration
