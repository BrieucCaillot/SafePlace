import { useEffect, useState } from 'react'

import useSceneStore from '@/stores/useSceneStore'
import useAudioStore from '@/stores/useAudioStore'
import LayoutBlob from '@/components/common/UI/LayoutBlob'
import SVGSoundOff from '@/components/common/UI/SVG/SVGSoundOff'
import SVGSoundOn from '@/components/common/UI/SVG/SVGSoundOn'

const LayoutSoundButton = () => {
  const isAudioMuted = useAudioStore((state) => state.isAudioMuted)
  const setIsAudioMuted = useAudioStore((state) => state.setIsAudioMutued)

  const onClick = () => {
    setIsAudioMuted(!isAudioMuted)
  }

  return (
    <LayoutBlob onClick={onClick}>
      {isAudioMuted ? (
        <SVGSoundOff className='absolute top-2/3 left-1/2 transform -translate-y-1/2 -translate-x-1/2' />
      ) : (
        <SVGSoundOn className='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2' />
      )}
    </LayoutBlob>
  )
}

export default LayoutSoundButton
