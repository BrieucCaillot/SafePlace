import useAudioStore from '@/stores/useAudioStore'
import useSceneStore from '@/stores/useSceneStore'
import { Howler } from 'howler'
import { useControls } from 'leva'
import { useEffect } from 'react'

const LayoutAudio = (): null => {
  const inTransition = useSceneStore((s) => s.inTransition)
  const scene = useSceneStore((s) => s.renderedScene)
  useAudioStore((s) => s.ambiantHowlMap.get(scene))

  const { volume } = useControls({ volume: { min: 0, max: 1, value: 0.5 } })
  useEffect(() => {
    Howler.volume(volume)
  }, [volume])

  useEffect(() => {
    if (inTransition || scene === null) return
    const { ambiantHowlMap } = useAudioStore.getState()
    const ambiant = ambiantHowlMap.get(scene)
    ambiant.play()
    return () => {
      ambiant.stop()
    }
  }, [scene, inTransition])

  return null
}

export default LayoutAudio
