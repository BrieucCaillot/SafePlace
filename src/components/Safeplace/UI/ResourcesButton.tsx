import LayoutShapeLink from '@/components/common/UI/LayoutShapeLink'
import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'

const ResourcesButton = () => {
  const POIsWhereHidden = [
    SafeplacePOI.Outside,
    SafeplacePOI.OnBoarding,
    SafeplacePOI.Resources,
    SafeplacePOI.ResourceFocused,
    SafeplacePOI.MountainPedestal,
    SafeplacePOI.PlaceholderPedetral1,
    SafeplacePOI.PlaceholderPedetral2,
    SafeplacePOI.PlaceholderPedetral3,
    SafeplacePOI.PlaceholderPedetral4,
  ]

  const isCurrentlyAvailable = useSafeplaceStore(
    (state) => !POIsWhereHidden.includes(state.currentPOI)
  )

  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)

  return (
    <LayoutShapeLink
      className={`shape-link__resources ${
        isCurrentlyAvailable ? 'block' : 'hidden'
      }`}
    >
      <div
        className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer'
        onClick={() => setCurrentPOI(SafeplacePOI.Resources)}
      >
        <p className='text-primary text-2xl'>Resources</p>
      </div>
    </LayoutShapeLink>
  )
}

export default ResourcesButton
