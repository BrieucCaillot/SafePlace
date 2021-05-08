import Place from '@/constants/enums/Place'
import Routes from '@/constants/enums/Routes'

import PortalUI from '@/components/common/UI/PortalUI'
import Timeline from '@/components/Journey/UI/Timeline'
import LayoutShelterButton from '@/components/common/UI/LayoutShelterButton'
import JourneyCompletedButton from '@/components/Journey/UI/JourneyCompletedButton'
import TimelineStatusButton from '@/components/Journey/UI/TimelineStatusButton'

const Journey = () => {
  return (
    <>
      <JourneyCompletedButton />
      <PortalUI selector='#layout-bottom-left'>
        <LayoutShelterButton from={Place.Journey} to={Routes.Safeplace} />
      </PortalUI>
      <PortalUI selector='#layout-bottom-middle'>
        <Timeline />
      </PortalUI>
      <PortalUI selector='#layout-bottom-right'>
        <TimelineStatusButton />
      </PortalUI>
    </>
  )
}

export default Journey
