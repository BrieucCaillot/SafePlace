import PortalUI from '@/components/common/UI/PortalUI'
import ResourcesButton from '@/components/Safeplace/UI/ResourcesButton'
import InsideButton from '@/components/Safeplace/UI/InsideButton'

const Safeplace = () => {
  return (
    <>
      <PortalUI selector='#layout-bottom-left'>
        <ResourcesButton />
        <InsideButton />
      </PortalUI>
    </>
  )
}

export default Safeplace
