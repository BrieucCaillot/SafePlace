import { useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import Routes from '@/constants/enums/Routes'

import ButtonShapeLink from '@/components/common/UI/Buttons/ButtonShapeLink'
import useUserStore from '@/stores/useUserStore'

const ResourcesButton = ({ show }: { show: boolean }) => {
  const isVoiceoverPlayed = useUserStore((s) => s.userData.voiceover.inside)

  return (
    <CSSTransition
      in={show && isVoiceoverPlayed}
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
