import React from 'react'
import Link from 'next/link'

import Routes from '@/constants/enums/Routes'
import useUserStore from '@/stores/useUserStore'

const JourneyCompletedButton = () => {
  const isJourneyCompleted = useUserStore((s) => s.isJourneyCompleted)

  return isJourneyCompleted ? (
    <div className='absolute bottom-16 flex justify-center w-full fadeIn'>
      <Link href={Routes.Resources} as={Routes.Resources}>
        <button className='relative button-stonefull text-secondary text-xl font-bold tracking-widest rounded px-10 py-3 focus:outline-none cursor-pointer pointer-events-auto'>
          Retour à l'abri
        </button>
      </Link>
    </div>
  ) : null
}

export default JourneyCompletedButton
