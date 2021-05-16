import React from 'react'

import Routes from '@/constants/enums/Routes'
import ButtonShapeLink from '@/components/common/UI/Buttons/ButtonShapeLink'

const ButtonJourneyCompleted = () => {
  return (
    <div className='absolute bottom-36 flex justify-center w-full fadeIn'>
      <ButtonShapeLink
        className={`shape-link__safeplace px-6 py-3 text-primary`}
        route={Routes.Resources}
      >
        Retour à l'abris
      </ButtonShapeLink>
    </div>
  )
}

export default ButtonJourneyCompleted
