import { useEffect, useState } from 'react'

import useSceneStore from '@/stores/useSceneStore'
import useAudioStore from '@/stores/useVoiceoverStore'
import LayoutBlob from '@/components/common/UI/LayoutBlob'
import SVGSoundOff from '@/components/common/UI/SVG/SVGSoundOff'
import SVGSoundOn from '@/components/common/UI/SVG/SVGSoundOn'

const LayoutSoundButton = () => {
  const renderedScene = useSceneStore()

  const [isSoundPlaying, setIsSoundPlaying] = useState(false)

  const onClick = () => {
    setIsSoundPlaying(!isSoundPlaying)
  }

  useEffect(() => {
    if (!renderedScene) return
  }, [renderedScene])

  return (
    <LayoutBlob onClick={onClick}>
      {isSoundPlaying ? (
        <SVGSoundOn className='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2' />
      ) : (
        <SVGSoundOff className='absolute top-2/3 left-1/2 transform -translate-y-1/2 -translate-x-1/2' />
      )}
    </LayoutBlob>
  )
}

export default LayoutSoundButton
