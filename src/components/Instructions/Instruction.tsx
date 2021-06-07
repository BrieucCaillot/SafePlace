import { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import gsap from 'gsap'
import SplitType from 'split-type'

import usePlayAudio from '@/hooks/audio/usePlayAudio'
import VOICEOVER from '@/constants/VOICEOVER'

import ButtonStonecut from '@/components/common/UI/Buttons/ButtonStonecut'

const TIMEOUT = 2000

const Instruction = ({
  show: parentShow,
  instruction,
  currentInstruction,
  text,
  textAnimDuration,
  textClassName,
  buttonText,
  onNextStep,
}: {
  show: boolean
  instruction: number
  currentInstruction: number
  text: string
  textAnimDuration?: number
  textClassName?: string
  buttonText: string
  onNextStep: () => void
}) => {
  const contentRef = useRef<HTMLDivElement>()

  const show = currentInstruction === instruction && parentShow

  const [hide, setHide] = useState(false)
  const [isVoiceoverPlayed, setIsVoiceoverPlayed] = useState(false)

  usePlayAudio(
    VOICEOVER.SAFEPLACE.INSTRUCTIONS[instruction], //---
    show, //---
    () => setIsVoiceoverPlayed(true) //---
  )

  useEffect((): GSAPCallback => {
    if (!show || hide) return

    const text = new SplitType(contentRef.current, {
      types: 'words, chars',
    })

    const anim = gsap.from(text.chars, {
      autoAlpha: 0,
      y: 20,
      duration: 1,
      rotationY: 45,
      transformOrigin: 'bottom left -20',
      stagger: { amount: textAnimDuration || 6 },
      onComplete: () => {
        text.revert()
      },
    })

    return () => anim.kill()
  }, [show, !hide])

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
      <div className='w-screen'>
        <p
          ref={contentRef}
          className={`text-primary text-stroke-6 font-sans text-xl leading-loose tracking-wider text-center pb-7 whitespace-pre-line m-auto ${textClassName}`}
        >
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
    </CSSTransition>
  )
}

export default Instruction
