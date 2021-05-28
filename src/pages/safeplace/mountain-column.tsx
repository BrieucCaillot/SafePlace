import { useEffect } from 'react'
import { TransitionStatus } from 'react-transition-group'

import ButtonShelterSafeplace from '@/components/Safeplace/UI/Buttons/ButtonShelterSafeplace'

import useTransitionStatus from '@/hooks/useTransitionStatus'
import useUserStore from '@/stores/useUserStore'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import VOICEOVER from '@/constants/VOICEOVER'
import usePlayAudio from '@/hooks/audio/usePlayAudio'

const MountainColumn = ({ status }: { status: TransitionStatus }) => {
  const show = useTransitionStatus(status)

  const isVoiceoverPlayed = useUserStore(
    (s) => s.userData.voiceover.mountainColumn
  )
  let shouldPlayVoiceover = useSafeplaceStore(
    (s) => !s.isCameraTravelling && s.currentPOI === SafeplacePOI.MountainColumn
  )

  usePlayAudio(
    VOICEOVER.SAFEPLACE.MOUTAIN_COLUMN,
    shouldPlayVoiceover && !isVoiceoverPlayed,
    () => useUserStore.getState().setVoiceoverStatus({ mountainColumn: true })
  )

  return (
    <>
      <ButtonShelterSafeplace show={show} direction='left' />
    </>
  )
}

export default MountainColumn
