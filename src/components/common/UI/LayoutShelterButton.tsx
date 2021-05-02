import Place from '@/constants/enums/Place'
import LayoutShapeLink from '@/components/common/UI/LayoutShapeLink'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'

const LayoutShelterButton = ({ place }: { place: Place }) => {
  const POIsWhereHidden = [
    SafeplacePOI.Outside,
    SafeplacePOI.OnBoarding,
    SafeplacePOI.Inside,
    SafeplacePOI.ResourceFocused,
  ]

  const router = useRouter()

  const isCurrentlyAvailableSafeplace = useSafeplaceStore(
    (state) => !POIsWhereHidden.includes(state.currentPOI)
  )
  const isAvailable = useMemo(
    () => isCurrentlyAvailableSafeplace || place == Place.Journey,
    [isCurrentlyAvailableSafeplace, place]
  )
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)

  const onClick = useCallback(() => {
    setCurrentPOI(SafeplacePOI.Inside)
    if (place === Place.Journey) router.push('/safeplace')
  }, [place])

  return (
    <LayoutShapeLink
      className={`shape-link__shelter ${isAvailable ? 'block' : 'hidden'}`}
    >
      <div
        className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer'
        onClick={onClick}
      >
        <p className='text-white text-xl'>Abri</p>
      </div>
    </LayoutShapeLink>
  )
}

export default LayoutShelterButton
