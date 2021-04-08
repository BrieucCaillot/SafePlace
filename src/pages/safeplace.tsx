import React from 'react'
import { createPortal } from 'react-dom'

import ColumnBackButton from '@/components/Safeplace/UI/ColumnBackButton'
import SafeplaceTimeline from '@/components/Safeplace/UI/SafeplaceTimeline'

const Safeplace = () => {
  return (
    <>
      {/* {createPortal(SafeplaceTimeline, document.body)} */}
      <ColumnBackButton />
    </>
  )
}

export default Safeplace
