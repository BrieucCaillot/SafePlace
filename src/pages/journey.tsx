import PortalUI from '@/components/common/UI/PortalUI'
import ButtonJourneyCompleted from '@/components/Journey/UI/Buttons/ButtonJourneyCompleted'
import Timeline from '@/components/Journey/UI/Timeline'
import TimelineStatusButton from '@/components/Journey/UI/TimelineStatusButton'
import LayoutShelterButton from '@/components/common/UI/LayoutShelterButton'

import Routes from '@/constants/enums/Routes'

import useJourneyStore from '@/stores/useJourneyStore'
import { useControls } from 'leva'

const Journey = () => {
  const buttonCallback = useJourneyStore((s) => s.endButtonCallback)

  return (
    <>
      <ButtonJourneyCompleted
        show={buttonCallback !== null}
        onClick={buttonCallback}
      />
      <PortalUI selector='#layout-bottom-left'>
        <LayoutShelterButton to={Routes.Safeplace} />
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
