import { useMemo } from 'react'

import useUserStore from '@/stores/useUserStore'
import Place from '@/constants/enums/Place'
import Routes from '@/constants/enums/Routes'

import ButtonShapeLink from '@/components/common/UI/Buttons/ButtonShapeLink'

const LayoutShelterButton = ({ from, to }: { from: Place; to: Routes }) => {
  const isJourneyFinished = useUserStore((s) => s.isJourneyFinished)

  const isAvailable = useMemo(() => Place.Journey && !isJourneyFinished, [
    isJourneyFinished,
  ])

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
