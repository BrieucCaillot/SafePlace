import React, { useCallback, useState } from 'react'

import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import OnBoardingWelcome from '../OnBoarding/OnBoardingWelcome'

const SafeplaceDom = () => {
  const [showWelcome, setShowWelcome] = useState<boolean>(true)

  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)

  const onStart = useCallback(() => {
    setShowWelcome(false)
    setCurrentPOI(SafeplacePOI.OnBoarding)
  }, [])

  return (
    <main className='h-full'>
      <div className='container h-full'>
        <div id='on-boarding' className='relative h-full w-full'>
          {showWelcome && <OnBoardingWelcome onStart={onStart} />}
          {/* <OnBoardingTransition /> */}
        </div>
      </div>
    </main>
  )
}

export default SafeplaceDom
