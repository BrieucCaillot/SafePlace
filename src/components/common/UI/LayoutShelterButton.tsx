import { useMemo } from 'react'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import Place from '@/constants/enums/Place'
import Routes from '@/constants/enums/Routes'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'

import LayoutShapeLink from '@/components/common/UI/LayoutShapeLink'

const LayoutShelterButton = ({ from, to }: { from: Place; to: Routes }) => {
  const POIsWhereHidden = [
    SafeplacePOI.Outside,
    SafeplacePOI.OnBoarding,
    SafeplacePOI.Inside,
    SafeplacePOI.ResourceFocused,
  ]

  const isCurrentlyAvailable = useSafeplaceStore(
    (state) => !POIsWhereHidden.includes(state.currentPOI)
  )
  const isAvailable = useMemo(
    () => isCurrentlyAvailable || from == Place.Journey,
    [isCurrentlyAvailable]
  )

  return (
    <LayoutShapeLink
      className={`shape-link__shelter ${isAvailable ? 'fadeIn' : 'hidden'}`}
      route={to}
    >
      <span className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 block pointer-events-auto cursor-pointer'>
        <span className='text-white text-xl'>Abri</span>
      </span>
    </LayoutShapeLink>
  )
}

export default LayoutShelterButton
