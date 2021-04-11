import PortalUI from '@/components/common/UI/PortalUI'
import ResourcesButton from '@/components/Safeplace/UI/ResourcesButton'
import ColumnBackButton from '@/components/Safeplace/UI/ColumnBackButton'
import InsideButton from '@/components/Safeplace/UI/InsideButton'

const Safeplace = () => {
  return (
    <>
      <PortalUI selector='#layout-bottom-left'>
        <ResourcesButton />
        <ColumnBackButton />
      </PortalUI>
      <PortalUI selector='#layout-bottom-right'>
        <InsideButton />
      </PortalUI>
    </>
  )
}

export default Safeplace
