import SFX from '@/constants/SFX'
import useAudioStore from '@/stores/useAudioStore'
import useSceneStore from '@/stores/useSceneStore'
import { Howler } from 'howler'
import { useControls } from 'leva'
import { useEffect } from 'react'

const LayoutAudio = (): null => {
  const inTransition = useSceneStore((s) => s.inTransition)
  const scene = useSceneStore((s) => s.renderedScene)

  const isMuted = useAudioStore((s) => s.isMuted)
  const buttonAudio = useAudioStore((s) => s.initAudio(SFX.BUTTON))
  const cloudsAudio = useAudioStore((s) => s.initAudio(SFX.CLOUDS))

  const { globalvolume, buttonVolume, cloudsVolume } = useControls(
    'audio',
    {
      globalvolume: { min: 0, max: 1, value: 1 },
      buttonVolume: { min: 0, max: 1, value: 0.14 },
      cloudsVolume: { min: 0, max: 1, value: 0.14 },
    },
    { collapsed: true }
  )
  useEffect(() => {
    Howler.volume(isMuted ? 0 : globalvolume)
  }, [globalvolume, isMuted])
  useEffect(() => {
    buttonAudio.volume(buttonVolume)
  }, [buttonVolume])
  useEffect(() => {
    cloudsAudio.volume(cloudsVolume)
  }, [cloudsVolume])

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
