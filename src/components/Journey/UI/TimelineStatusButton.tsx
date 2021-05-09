import React, { useState } from 'react'

import ButtonBlob from '@/components/common/UI/Buttons/ButtonBlob'
import SVGPlay from '@/components/Journey/UI/SVG/SVGPlay'
import SVGPause from '@/components/Journey/UI/SVG/SVGPause'

const TimelineStatusButton = () => {
  const [playing, setPlaying] = useState(false)

  const onClick = () => {
    setPlaying(!playing)
  }

  return (
    <ButtonBlob onClick={onClick}>
      {playing ? (
        <SVGPlay className='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2' />
      ) : (
        <SVGPause className='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2' />
      )}
    </ButtonBlob>
  )
}

export default TimelineStatusButton
