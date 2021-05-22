import { useEffect, useMemo, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import useAudioStore from '@/stores/useAudioStore'
import InstructionsList from '@/constants/enums/InstructionsList'
import Place from '@/constants/enums/Place'
import AudioStatus from '@/constants/enums/Audio'
import ButtonStonecut from '../common/UI/Buttons/ButtonStonecut'

const TIMEOUT = 2000

const Instruction = ({
  show,
  instruction,
  text,
  onNextStep,
}: {
  show: boolean
  instruction: InstructionsList
  text: string
  onNextStep: () => void
}) => {
  const isLastStep = useMemo(
    () => instruction == InstructionsList.Instruction3,
    []
  )

  const [hide, setHide] = useState(false)

  const isVoiceoverPlayed = useAudioStore((state) =>
    state.checkVoiceoverStatus(instruction, AudioStatus.Played)
  )

  const buttonActiveClass = useMemo(
    () =>
      isVoiceoverPlayed ? 'cursor-pointer fadeIn' : 'cursor-auto opacity-0',

    [isVoiceoverPlayed]
  )

  useEffect(() => {
    if (!show) return
    useAudioStore.getState().setCurrentVoiceover(Place.Safeplace, instruction)
  }, [show])

  return (
    <CSSTransition
      in={show && !hide}
      timeout={TIMEOUT}
      classNames='elem-fade'
      mountOnEnter
      onExited={onNextStep}
      appear
    >
      <div className='flex flex-col flex-1 justify-center'>
        <p
          className={`text-primary text-stroke-6 font-sans text-xl leading-loose tracking-wider text-center pb-7 whitespace-pre-line`}
        >
          {text}
        </p>
        <ButtonStonecut
          show={show}
          className={`${buttonActiveClass} text-tertiary`}
          onClick={() => setHide(true)}
        >
          {isLastStep ? 'Rejoindre la safeplace' : 'Continuer'}
        </ButtonStonecut>
      </div>
    </CSSTransition>
  )
}

export default Instruction
