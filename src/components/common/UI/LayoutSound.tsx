import { useEffect, useState } from 'react'

import LayoutBlob from './LayoutBlob'
import SVGSoundOff from './SVG/SVGSoundOff'
import SVGSoundOn from './SVG/SVGSoundOn'

const LayoutSound = () => {
  const [isSoundPlaying, setIsSoundPlaying] = useState(false)

  const onClick = () => {
    setIsSoundPlaying(!isSoundPlaying)
  }

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

export default LayoutSound
