import Place from '@/constants/enums/Place'
import PortalUI from '@/components/common/UI/PortalUI'
import ResourcesButton from '@/components/Safeplace/UI/ResourcesButton'
import LayoutShelterButton from '@/components/common/UI/LayoutShelterButton'

const Safeplace = () => {
  return (
    <>
      <PortalUI selector='#layout-bottom-left'>
        <LayoutShelterButton place={Place.Safeplace} />
        <ResourcesButton />
      </PortalUI>
    </>
  )
}

export default Safeplace
