import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

const ButtonJourneyCompleted = ({
  show,
  onClick,
}: {
  show: boolean
  onClick: () => void
}) => {
  const [hide, setHide] = useState(false)

  return (
    <CSSTransition
      in={show && !hide}
      timeout={2000}
      classNames='elem-fade'
      mountOnEnter
      unmountOnExit
      appear
    >
      <div className='fixed bottom-40  left-1/2 -translate-x-1/2 -ml-20 pointer-events-none'>
        <button
          onClick={() => {
            onClick()
            setHide(true)
          }}
          className='shape shape-link shape-link__safeplace whitespace-nowrap px-6 py-3 text-primary pointer-events-auto outline-none focus:outline-none relative cursor-pointer'
        >
          <span className='block w-full text-xl pointer-events-none'>
            Retour à l'abris
          </span>
        </button>
      </div>
    </CSSTransition>
  )
}

export default ButtonJourneyCompleted
