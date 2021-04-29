import LayoutShapeLink from '@/components/common/UI/LayoutShapeLink'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import SafeplacePOI from 'constants/enums/SafeplacePOI'

const ResourcesButton = () => {
  const POIsWhereHidden = [
    SafeplacePOI.Outside,
    SafeplacePOI.OnBoarding,
    SafeplacePOI.Resources,
    SafeplacePOI.ResourceFocused,
    SafeplacePOI.MountainColumn,
    SafeplacePOI.PlaceholderColumn1,
    SafeplacePOI.PlaceholderColumn2,
    SafeplacePOI.PlaceholderColumn3,
    SafeplacePOI.PlaceholderColumn4,
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
        <p className='text-white text-xl'>Ressources</p>
      </div>
    </LayoutShapeLink>
  )
}

export default ResourcesButton
