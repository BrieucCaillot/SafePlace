import { useEffect, useMemo, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import useAudioStore from '@/stores/useAudioStore'
import InstructionsList from '@/constants/enums/InstructionsList'
import Place from '@/constants/enums/Place'

const Instruction = ({
  instruction,
  text,
  onNextStep,
}: {
  instruction: InstructionsList
  text: string
  onNextStep: Function
}) => {
  const [show, setShow] = useState(false)

  const isLastStep = useMemo(
    () => instruction == InstructionsList.Instruction3,
    []
  )

  const setCurrentVoiceover = useAudioStore(
    (state) => state.setCurrentVoiceover
  )
  const isVoiceoverPlayed = useAudioStore((state) => state.isVoiceoverPlayed)

  const buttonActiveClass = useMemo(
    () =>
      isVoiceoverPlayed
        ? 'cursor-pointer pointer-events-auto fadeIn'
        : 'opacity-0',

    [isVoiceoverPlayed]
  )

  const handleClick = () => {
    onNextStep()
  }

  useEffect(() => {
    setShow(true)

    setCurrentVoiceover(Place.Safeplace, instruction)

    return () => {
      setShow(false)
    }
  }, [])

  return (
    <CSSTransition in={show} timeout={0} classNames='instruction'>
      <div className='flex flex-col justify-center'>
        {/* <img
          className='m-auto max-w-4xl'
          src={`/img/Instructions/${Instruction}.png`}
        /> */}

        <p className={`text-primary text-lg text-center pb-7 max-w-lg`}>
          {text}
        </p>
        <button
          onClick={handleClick}
          className={`bg-primary text-white rounded-lg px-6 py-3 m-auto ${buttonActiveClass}`}
        >
          {isLastStep ? 'Rejoindre la safeplace' : 'Continuer'}
        </button>
      </div>
    </CSSTransition>
  )
}

export default Instruction
