import { useMemo } from 'react'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useUserStore from '@/stores/useUserStore'
import Place from '@/constants/enums/Place'
import Routes from '@/constants/enums/Routes'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'

import ButtonShapeLink from '@/components/common/UI/Buttons/ButtonShapeLink'

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
  const isJourneyFinished = useUserStore((s) => s.isJourneyFinished)

  const isAvailable = useMemo(
    () => isCurrentlyAvailable || (from == Place.Journey && !isJourneyFinished),
    [isCurrentlyAvailable, isJourneyFinished]
  )

  return (
    <ButtonShapeLink
      className={`shape-link__shelter py-1.5 px-5 text-white ${
        isAvailable ? 'fadeIn' : from == Place.Journey ? 'opacity-0' : 'hidden'
      }`}
      route={to}
    >
      Abri
    </ButtonShapeLink>
  )
}

export default LayoutShelterButton
