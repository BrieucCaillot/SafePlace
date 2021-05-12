import Place from '@/constants/enums/Place'
import Routes from '@/constants/enums/Routes'

import PortalUI from '@/components/common/UI/PortalUI'
import LayoutShelterButton from '@/components/common/UI/LayoutShelterButton'

const MountainColumn = () => {
  return (
    <>
      <PortalUI selector='#layout-bottom-left'>
        <LayoutShelterButton from={Place.Safeplace} to={Routes.Safeplace} />
      </PortalUI>
    </>
  )
}

export default MountainColumn
