import React, { useEffect } from 'react'

import Routes from '@/constants/enums/Routes'
import useUserStore from '@/stores/useUserStore'
import ButtonShapeLink from '@/components/common/UI/Buttons/ButtonShapeLink'

const JourneyCompletedButton = () => {
  const isJourneyFinished = useUserStore((s) => s.isJourneyFinished)

  useEffect(() => {
    const { setIsJourneyFinished } = useUserStore.getState()
    setIsJourneyFinished(false)
  }, [])

  return isJourneyFinished ? (
    <div className='absolute bottom-36 flex justify-center w-full fadeIn'>
      <ButtonShapeLink
        className={`shape-link__safeplace px-6 py-3 text-primary`}
        route={Routes.Resources}
      >
        Retour à l'abris
      </ButtonShapeLink>
    </div>
  ) : null
}

export default JourneyCompletedButton
