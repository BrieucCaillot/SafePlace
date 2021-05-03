import Place from '@/constants/enums/Place'
import PortalUI from '@/components/common/UI/PortalUI'
import Timeline from '@/components/Journey/UI/Timeline'
import LayoutShelterButton from '@/components/common/UI/LayoutShelterButton'
import JourneyCompletedButton from '@/components/Journey/UI/JourneyCompletedButton'

const Journey = () => {
  return (
    <>
      <JourneyCompletedButton />
      <PortalUI selector='#layout-bottom-left'>
        <LayoutShelterButton place={Place.Journey} />
      </PortalUI>
      <PortalUI selector='#layout-bottom-middle'>
        <Timeline />
      </PortalUI>
    </>
  )
}

export default Journey
