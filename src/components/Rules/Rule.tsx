import { useEffect, useMemo, useState } from 'react'
import { CSSTransition, Transition } from 'react-transition-group'

import { Rules } from '@/stores/useRulesStore'

const Rule = ({
  rule,
  text,
  onNextStep,
}: {
  rule: Rules
  text: string
  onNextStep: Function
}) => {
  const [show, setShow] = useState(false)

  const isLastStep = useMemo(() => rule == Rules.Rule4, [])

  const onEntered = () => console.log('ON ENTERED' + rule)
  const onExited = () => console.log('ON EXITED' + rule)

  const handleClick = () => {
    console.log('FORC')
    onNextStep()
  }

  useEffect(() => {
    setShow(true)
    return () => {
      setShow(false)
    }
  }, [])

  return (
    <CSSTransition
      in={show}
      timeout={1000}
      unmountOnExit
      classNames='my-node'
      onEnter={() => setShow(true)}
      onExited={() => setShow(false)}
    >
      <div className='flex flex-col justify-center transition-all'>
        <img className='m-auto max-w-4xl' src={`/img/rules/${rule}.png`} />

        <p className={`text-primary text-center pb-7`}>{text}</p>
        <button
          onClick={handleClick}
          className='bg-primary text-white rounded-lg px-6 py-3 m-auto cursor-pointer pointer-events-auto'
        >
          {isLastStep ? 'Rejoindre la safeplace' : 'Continuer'}
        </button>
      </div>
    </CSSTransition>
  )
}

export default Rule
