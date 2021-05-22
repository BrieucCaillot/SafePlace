import { CSSTransition, TransitionStatus } from 'react-transition-group'

import useAudioStore from '@/stores/useAudioStore'
import useTransitionStatus from '@/hooks/useTransitionStatus'
import { VoiceoverSafeplace } from '@/constants/enums/Voiceover'
import AudioStatus from '@/constants/enums/Audio'

import Instructions from '@/components/Instructions/Instructions'

const OnBoarding = ({ status }: { status: TransitionStatus }) => {
  const show = useTransitionStatus(status)

  const isVoiceoverSafeplaceArrivedPlayed = useAudioStore((s) =>
    s.checkVoiceoverStatus(VoiceoverSafeplace.Arrived, AudioStatus.Played)
  )

  return (
    <CSSTransition
      in={show && isVoiceoverSafeplaceArrivedPlayed}
      timeout={2000}
      classNames='elem-fade'
      mountOnEnter
      appear
    >
      <Instructions show={show && isVoiceoverSafeplaceArrivedPlayed} />
    </CSSTransition>
  )
}

export default OnBoarding
