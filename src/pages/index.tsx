import React, { useCallback, useEffect, useState } from 'react'

import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import OnBoardingWelcome from '@/components/OnBoarding/OnBoardingWelcome'
import OnBoardingTransition from '@/components/OnBoarding/OnBoardingTransition'
import Bottom from '@/components/common/Bottom/Bottom'

const Index = () => {
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)

  const [showWelcome, setShowWelcome] = useState<boolean>(true)

  useEffect(() => {
    setCurrentPOI(SafeplacePOI.Bridge)
  }, [])

  const onStart = useCallback(() => {
    setShowWelcome(false)
    setCurrentPOI(SafeplacePOI.OnBoarding)
  }, [])

  return (
    <>
      <main className='h-full'>
        <div className='container h-full'>
          <div id='on-boarding' className='relative h-full w-full'>
            {showWelcome && <OnBoardingWelcome onStart={onStart} />}
            {/* <OnBoardingTransition /> */}
          </div>
        </div>
      </main>
      <Bottom />
    </>
  )
}

export default Index
