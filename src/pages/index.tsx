import React, { useEffect } from 'react'

import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import Bottom from '@/components/common/Bottom/Bottom'
import SafeplaceDom from '@/components/Safeplace/SafeplaceDom'

const Index = () => {
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)

  useEffect(() => {
    setCurrentPOI(SafeplacePOI.Bridge)
  }, [])

  return (
    <>
      <SafeplaceDom />
      <Bottom />
    </>
  )
}

export default Index
