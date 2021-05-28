import { TransitionStatus } from 'react-transition-group'
import useTransitionStatus from '@/hooks/useTransitionStatus'
import PortalUI from '@/components/common/UI/PortalUI'
import ResourcesButton from '@/components/Safeplace/UI/ResourcesButton'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import useDropPromise from '@/hooks/promise/useDropPromise'
import { useEffect } from 'react'
import useAudioStore from '@/stores/useAudioStore'
import VOICEOVER from '@/constants/VOICEOVER'
import useUserStore from '@/stores/useUserStore'
import usePlayAudio from '@/hooks/audio/usePlayAudio'

const Safeplace = ({ status }: { status: TransitionStatus }) => {
  const show = useTransitionStatus(status)

  const isVoiceoverPlayed = useUserStore((s) => s.userData.voiceover.inside)
  const areResourcesAvailable = useSafeplaceStore((s) =>
    s.isCurrentlyAvailable(SafeplacePOI.Resources)
  )
  let shouldPlayVoiceover = useSafeplaceStore(
    (s) => !s.isCameraTravelling && s.currentPOI === SafeplacePOI.Inside
  )

  usePlayAudio(
    VOICEOVER.SAFEPLACE.INSIDE,
    shouldPlayVoiceover && !isVoiceoverPlayed,
    () => useUserStore.getState().setVoiceoverStatus({ inside: true })
  )

  return (
    <>
      <PortalUI selector='#layout-bottom-left'>
        <ResourcesButton
          show={show && isVoiceoverPlayed && areResourcesAvailable}
        />
      </PortalUI>
    </>
  )
}

export default Safeplace
