import LayoutShapeLink from '@/components/common/UI/LayoutShapeLink'
import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'

const InsideButton = () => {
  const POIsWhereHidden = [
    SafeplacePOI.Outside,
    SafeplacePOI.OnBoarding,
    SafeplacePOI.Inside,
    SafeplacePOI.ResourceFocused,
  ]

  const isCurrentlyAvailable = useSafeplaceStore(
    (state) => !POIsWhereHidden.includes(state.currentPOI)
  )
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)

  return (
    <LayoutShapeLink
      className={`shape-link__shelter ${
        isCurrentlyAvailable ? 'block' : 'hidden'
      }`}
    >
      <div
        className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer'
        onClick={() => setCurrentPOI(SafeplacePOI.Inside)}
      >
        <p className='text-primary text-2xl'>Abris</p>
      </div>
    </LayoutShapeLink>
  )
}

export default InsideButton
