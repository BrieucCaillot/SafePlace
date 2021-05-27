import { useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import ButtonStonecut from '../common/UI/Buttons/ButtonStonecut'
import VOICEOVER from '@/constants/VOICEOVER'
import useDropPromise from '@/hooks/promise/useDropPromise'
import useAudioStore from '@/stores/useAudioStore'
import usePlayAudio from '@/hooks/audio/usePlayAudio'

const TIMEOUT = 2000

const Instruction = ({
  show: parentShow,
  instruction,
  currentInstruction,
  text,
  buttonText,
  onNextStep,
}: {
  show: boolean
  instruction: number
  currentInstruction: number
  text: string
  buttonText: string
  onNextStep: () => void
}) => {
  const show = currentInstruction === instruction && parentShow

  const [hide, setHide] = useState(false)
  const [isVoiceoverPlayed, setIsVoiceoverPlayed] = useState(false)

  usePlayAudio(
    VOICEOVER.SAFEPLACE.INSTRUCTIONS[instruction], //---
    show, //---
    () => setIsVoiceoverPlayed(true) //---
  )

  return (
    <CSSTransition
      in={show && !hide}
      timeout={TIMEOUT}
      classNames='elem-fade'
      mountOnEnter={true}
      unmountOnExit={true}
      onExited={onNextStep}
      appear={true}
    >
      <div
        className='absolute transform-gpu -translate-x-1/2 -translate-y-1/2'
        style={{ left: '50vw', top: '50vh' }}
      >
        <div className='w-screen'>
          <p className='text-primary text-stroke-6 font-sans text-xl leading-loose tracking-wider text-center pb-7 whitespace-pre-line'>
            {text}
          </p>
          <ButtonStonecut
            show={show && !hide && isVoiceoverPlayed}
            className='text-tertiary opacity-0 pointer-events-none block'
            onClick={() => setHide(true)}
          >
            {buttonText}
          </ButtonStonecut>
        </div>
      </div>
    </CSSTransition>
  )
}

export default Instruction
