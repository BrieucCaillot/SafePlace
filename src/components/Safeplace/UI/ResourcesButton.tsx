import { useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import Routes from '@/constants/enums/Routes'

import ButtonShapeLink from '@/components/common/UI/Buttons/ButtonShapeLink'

const ResourcesButton = ({ show }: { show: boolean }) => {
  return (
    <CSSTransition
      in={show}
      timeout={1000}
      classNames='elem-fade'
      mountOnEnter
      unmountOnExit
      appear
    >
      <ButtonShapeLink
        className={`shape-link__resources px-5 py-1.5 text-white`}
        route={Routes.Resources}
      >
        Ressources
      </ButtonShapeLink>
    </CSSTransition>
  )
}

export default ResourcesButton
