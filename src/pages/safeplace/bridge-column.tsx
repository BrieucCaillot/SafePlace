import React from 'react'
import { TransitionStatus } from 'react-transition-group'
import { CSSTransition } from 'react-transition-group'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useTransitionStatus from '@/hooks/animation/useTransitionStatus'

import ButtonShelterSafeplace from '@/components/Safeplace/UI/Buttons/ButtonShelterSafeplace'

const BridgeColumn = ({ status }: { status: TransitionStatus }) => {
  const isCameraTravelling = useSafeplaceStore((s) => s.isCameraTravelling)
  const show = useTransitionStatus(status)

  return (
    <>
      <div className={`fixed top-screen-h/2 flex justify-start w-full `}>
        <ButtonShelterSafeplace show={show} direction='left' />
      </div>
      <CSSTransition
        in={show && !isCameraTravelling}
        timeout={2000}
        classNames='elem-fade'
        mountOnEnter
        unmountOnExit
        appear
      >
        <div
          id='end'
          className='bg-secondary flex justify-center fixed bottom-14 left-1/2 transform-gpu -translate-x-1/2 -translate-y-1/2 w-9/12 md:w-max p-5 rounded-md text-center cursor-default pointer-events-auto'
        >
          <p>
            Vous avez atteint la fin de notre prototype. <br /> Dans l’attente
            d’un nouveau voyage méditatif, nous vous invitons à prendre une
            pause dans votre safe place.
          </p>
        </div>
      </CSSTransition>
    </>
  )
}

export default BridgeColumn
