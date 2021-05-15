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
      {playing ? <SVGPlay /> : <SVGPause />}
    </ButtonBlob>
  )
}

export default TimelineStatusButton
