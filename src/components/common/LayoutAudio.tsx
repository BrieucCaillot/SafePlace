import SFX from '@/constants/SFX'
import useAudioStore from '@/stores/useAudioStore'
import useSceneStore from '@/stores/useSceneStore'
import { Howler } from 'howler'
import { useControls } from 'leva'
import { useEffect } from 'react'

const LayoutAudio = (): null => {
  const inTransition = useSceneStore((s) => s.inTransition)
  const scene = useSceneStore((s) => s.nextScene || s.renderedScene)

  const isMuted = useAudioStore((s) => s.isMuted)
  const buttonAudio = useAudioStore((s) => s.initAudio(SFX.BUTTON))
  const cloudsAudio = useAudioStore((s) => s.initAudio(SFX.CLOUDS))

  const {
    globalvolume,
    buttonVolume,
    cloudsVolume,
    ambiantVolume,
  } = useControls(
    'audio',
    {
      globalvolume: { min: 0, max: 1, value: 1 },
      ambiantVolume: { min: 0, max: 1, value: 1 },
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
    if (scene === null) return
    const { ambiantHowlMap } = useAudioStore.getState()
    const ambiant = ambiantHowlMap.get(scene)
    ambiant.stop()
    ambiant.play()
    ambiant.fade(ambiant.volume(), ambiantVolume, 2000)
    return () => void ambiant.fade(ambiant.volume(), 0, 2000)
  }, [scene, ambiantVolume])

  return null
}

export default LayoutAudio
