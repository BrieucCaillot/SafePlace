import React, { useCallback } from 'react'

import Routes from '@/constants/enums/Routes'
import useUserStore from '@/stores/useUserStore'

const JourneyCompletedButton = () => {
  const router = useUserStore((s) => s.router)

  const isJourneyCompleted = useUserStore((s) => s.isJourneyCompleted)

  return isJourneyCompleted ? (
    <div
      className='absolute bottom-36 flex justify-center w-full'
      onClick={() => router.push(Routes.ResourcesFocus)}
    >
      <button className='relative button-stonefull text-secondary text-xl font-bold tracking-widest rounded px-10 py-3 focus:outline-none cursor-pointer pointer-events-auto'>
        Retour à l'abri
      </button>
    </div>
  ) : null
}

export default JourneyCompletedButton
