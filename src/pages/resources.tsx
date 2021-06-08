import { TransitionStatus } from 'react-transition-group'

import useUserStore from '@/stores/useUserStore'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useTransitionStatus from '@/hooks/animation/useTransitionStatus'
import usePlayAudio from '@/hooks/audio/usePlayAudio'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import VOICEOVER from '@/constants/VOICEOVER'

import ButtonShelterSafeplace from '@/components/Safeplace/UI/Buttons/ButtonShelterSafeplace'

const Resources = ({ status }: { status: TransitionStatus }) => {
  const show = useTransitionStatus(status)

  const isVoiceoverPlayed = useUserStore(
    (s) => s.userData.voiceover.backFromJourney
  )
  const isJourneyFinished = useUserStore((s) => s.userData.journey)
  const shouldPlayVoiceover = useSafeplaceStore(
    (s) =>
      isJourneyFinished &&
      !s.isCameraTravelling &&
      s.currentPOI === SafeplacePOI.Resources
  )

  usePlayAudio(
    VOICEOVER.SAFEPLACE.BACK_FROM_JOURNEY,
    shouldPlayVoiceover && !isVoiceoverPlayed,
    () => useUserStore.getState().setVoiceoverStatus({ backFromJourney: true })
  )
  return (
    <div className={`fixed top-screen-h/2 flex justify-end w-full `}>
      <ButtonShelterSafeplace show={show} direction='right' />
    </div>
  )
}

export default Resources
