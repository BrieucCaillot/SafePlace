import React, { useCallback } from 'react'

import useUserStore from '@/stores/useUserStore'

const JourneyCompletedButton = () => {
  const router = useUserStore((s) => s.router)

  const isJourneyCompleted = useUserStore((s) => s.isJourneyCompleted)

  return (
    <>
      {isJourneyCompleted && (
        <div
          className='absolute bottom-36 flex justify-center w-full'
          onClick={() => router.push('/resource/journey')}
        >
          <button className='relative button-stonefull text-secondary text-xl font-bold tracking-widest rounded px-10 py-3 focus:outline-none cursor-pointer pointer-events-auto'>
            Retour à l'abris
          </button>
        </div>
      )}
    </>
  )
}

export default JourneyCompletedButton
