import { CSSTransition, TransitionStatus } from 'react-transition-group'
import useTransitionStatus from '@/hooks/animation/useTransitionStatus'

import Instructions from '@/components/Instructions/Instructions'
import useSceneStore from '@/stores/useSceneStore'
import VOICEOVER from '@/constants/VOICEOVER'
import useUserStore from '@/stores/useUserStore'
import usePlayAudio from '@/hooks/audio/usePlayAudio'

const OnBoarding = ({ status }: { status: TransitionStatus }) => {
  const voiceOverIsPlayed = useUserStore((s) => s.userData.voiceover.arrived)
  const isPageTransitionFinished = useTransitionStatus(status)
  const inSceneTransition = useSceneStore((s) => s.inTransition)

  usePlayAudio(
    VOICEOVER.SAFEPLACE.ARRIVED,
    !inSceneTransition && !voiceOverIsPlayed,
    () => useUserStore.getState().setVoiceoverStatus({ arrived: true })
  )

  const showInstructions =
    !inSceneTransition && voiceOverIsPlayed && isPageTransitionFinished

  return (
    <CSSTransition
      in={showInstructions}
      timeout={2000}
      classNames='elem-fade'
      mountOnEnter
      appear
    >
      <Instructions show={showInstructions} />
    </CSSTransition>
  )
}

export default OnBoarding
