import { TransitionStatus } from 'react-transition-group'

import useAudioStore from '@/stores/useAudioStore'
import useTransitionStatus from '@/hooks/useTransitionStatus'
import { VoiceoverSafeplace } from '@/constants/enums/Voiceover'
import AudioStatus from '@/constants/enums/Audio'

import PortalUI from '@/components/common/UI/PortalUI'
import ResourcesButton from '@/components/Safeplace/UI/ResourcesButton'

const Safeplace = ({ status }: { status: TransitionStatus }) => {
  const show = useTransitionStatus(status)

  const isVoiceoverPlayed = useAudioStore((s) =>
    s.checkVoiceoverStatus(VoiceoverSafeplace.Inside, AudioStatus.Played)
  )

  return (
    <>
      <PortalUI selector='#layout-bottom-left'>
        <ResourcesButton show={show && isVoiceoverPlayed} />
      </PortalUI>
    </>
  )
}

export default Safeplace
