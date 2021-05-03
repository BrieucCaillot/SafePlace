import Place from '@/constants/enums/Place'

import PortalUI from '@/components/common/UI/PortalUI'
import LayoutShelterButton from '@/components/common/UI/LayoutShelterButton'
import ResourcesButton from '@/components/Safeplace/UI/ResourcesButton'

const Resources = () => {
  return (
    <>
      <PortalUI selector='#layout-bottom-left'>
        <LayoutShelterButton place={Place.Safeplace} />
        <ResourcesButton />
      </PortalUI>
    </>
  )
}

export default Resources
