import { useEffect } from 'react'

import useUserStore from '@/stores/useUserStore'
import Place from '@/constants/enums/Place'
import Routes from '@/constants/enums/Routes'

import PortalUI from '@/components/common/UI/PortalUI'
import ButtonJourneyCompleted from '@/components/Journey/UI/Buttons/ButtonJourneyCompleted'
import Timeline from '@/components/Journey/UI/Timeline'
import TimelineStatusButton from '@/components/Journey/UI/TimelineStatusButton'
import LayoutShelterButton from '@/components/common/UI/LayoutShelterButton'
import useJourneyStore from '@/stores/useJourneyStore'

const Journey = () => {
  const buttonCallback = useJourneyStore((s) => s.endButtonCallback)

  return (
    <>
      {buttonCallback !== null && (
        <ButtonJourneyCompleted onClick={buttonCallback} />
      )}
      <PortalUI selector='#layout-bottom-left'>
        <LayoutShelterButton from={Place.Journey} to={Routes.Safeplace} />
      </PortalUI>
      <PortalUI selector='#layout-bottom-middle'>
        <Timeline />
      </PortalUI>
      <PortalUI selector='#layout-bottom-right'>
        <div className='pl-3'>
          <TimelineStatusButton />
        </div>
      </PortalUI>
    </>
  )
}

export default Journey
