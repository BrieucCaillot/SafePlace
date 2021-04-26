import PortalUI from '@/components/common/UI/PortalUI'
import SafeplaceButton from '@/components/Journey/UI/SafeplaceButton'
import Timeline from '@/components/Journey/UI/Timeline'

const Journey = () => {
  return (
    <>
      <PortalUI selector='#layout-bottom-left'>
        <SafeplaceButton />
      </PortalUI>
      <PortalUI selector='#layout-bottom-middle'>
        <Timeline />
      </PortalUI>
    </>
  )
}

export default Journey
