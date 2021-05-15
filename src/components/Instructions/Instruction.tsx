import { useEffect, useMemo, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import useAudioStore from '@/stores/useAudioStore'
import InstructionsList from '@/constants/enums/InstructionsList'
import Place from '@/constants/enums/Place'
import AudioStatus from '@/constants/enums/Audio'
import ButtonStonecut from '../common/UI/Buttons/ButtonStonecut'

const Instruction = ({
  instruction,
  text,
  onNextStep,
}: {
  instruction: InstructionsList
  text: string
  onNextStep: () => void
}) => {
  const [show, setShow] = useState(false)

  const isLastStep = useMemo(
    () => instruction == InstructionsList.Instruction3,
    []
  )

  const isVoiceoverPlayed = useAudioStore((state) =>
    state.checkVoiceoverStatus(instruction, AudioStatus.Played)
  )

  const buttonActiveClass = useMemo(
    () =>
      isVoiceoverPlayed
        ? 'cursor-pointer pointer-events-auto fadeIn'
        : 'cursor-auto opacity-0',

    [isVoiceoverPlayed]
  )

  useEffect(() => {
    setShow(true)
    useAudioStore.getState().setCurrentVoiceover(Place.Safeplace, instruction)

    return () => setShow(false)
  }, [])

  return (
    <CSSTransition in={show} timeout={0} classNames='instruction'>
      <div className='flex flex-col flex-1 justify-center'>
        <p
          className={`text-primary text-stroke-6 font-sans text-xl leading-loose tracking-wider text-center pb-7 whitespace-pre-line`}
        >
          {text}
        </p>
        <ButtonStonecut
          className={`${buttonActiveClass} text-tertiary`}
          onClick={onNextStep}
        >
          {isLastStep ? 'Rejoindre la safeplace' : 'Continuer'}
        </ButtonStonecut>
      </div>
    </CSSTransition>
  )
}

export default Instruction
