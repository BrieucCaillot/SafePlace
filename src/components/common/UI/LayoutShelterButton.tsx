import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'

import useUserStore from '@/stores/useUserStore'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useJourneyStore from '@/stores/useJourneyStore'
import Place from '@/constants/enums/Place'
import JourneySection from '@/constants/enums/JourneySection'
import Routes from '@/constants/enums/Routes'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'

import LayoutShapeLink from '@/components/common/UI/LayoutShapeLink'

const LayoutShelterButton = ({ place }: { place: Place }) => {
  const POIsWhereHidden = [
    SafeplacePOI.Outside,
    SafeplacePOI.OnBoarding,
    SafeplacePOI.Inside,
    SafeplacePOI.ResourceFocused,
  ]

  const router = useRouter()

  const isCurrentlyAvailable = useSafeplaceStore(
    (state) => !POIsWhereHidden.includes(state.currentPOI)
  )
  const isAvailable = useMemo(
    () => isCurrentlyAvailable || place == Place.Journey,
    [isCurrentlyAvailable, place]
  )
  const isJourneyCompleted = useUserStore((s) => s.isJourneyCompleted)

  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)

  const onClick = useCallback(() => {
    switch (place) {
      case Place.Safeplace:
        router.push(Routes.Safeplace)
        setCurrentPOI(SafeplacePOI.Inside)
        break
      case Place.Journey:
        if (isJourneyCompleted) {
          router.push(Routes.ResourcesFocus)
        } else {
          router.push(Routes.Safeplace)
          setCurrentPOI(SafeplacePOI.Inside)
        }
        break
    }
  }, [place])

  return (
    <LayoutShapeLink
      className={`shape-link__shelter ${isAvailable ? 'fadeIn' : 'hidden'}`}
    >
      <span
        className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 block pointer-events-auto cursor-pointer'
        onClick={onClick}
      >
        <span className='text-white text-xl'>Abri</span>
      </span>
    </LayoutShapeLink>
  )
}

export default LayoutShelterButton
