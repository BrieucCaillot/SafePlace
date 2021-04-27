import { useEffect, useMemo, useState } from 'react'
import { CSSTransition, Transition } from 'react-transition-group'
import { Howl } from 'howler'

import { Instructions } from '@/pages/onboarding'

const Instruction = ({
  Instruction,
  text,
  onNextStep,
}: {
  Instruction: Instructions
  text: string
  onNextStep: Function
}) => {
  const [show, setShow] = useState(false)

  const isLastStep = useMemo(() => Instruction == Instructions.Instruction3, [])
  const [voiceoverDone, setVoiceoverDone] = useState(false)

  const buttonActiveClass = useMemo(
    () =>
      voiceoverDone
        ? 'cursor-pointer pointer-events-auto fadeInUp'
        : 'opacity-0',
    [voiceoverDone]
  )

  const voiceover = useMemo(() => {
    return new Howl({
      src: `/audios/voiceover/safeplace/safeplace_${Instruction}.mp3`,
      onend: () => {
        setVoiceoverDone(true)
      },
    })
  }, [])

  const handleClick = () => {
    onNextStep()
  }

  useEffect(() => {
    setShow(true)
    voiceover.play()

    return () => {
      setShow(false)
    }
  }, [])

  return (
    <CSSTransition
      in={show}
      timeout={2000}
      classNames='Instruction'
      // onEnter={() => setShow(true)}
      // onExited={() => setShow(false)}
    >
      <div className='flex flex-col justify-center transition-all'>
        <img
          className='m-auto max-w-4xl'
          src={`/img/Instructions/${Instruction}.png`}
        />

        <p className={`text-primary text-center pb-7 max-w-lg`}>{text}</p>
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
