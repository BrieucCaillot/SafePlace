import Routes from '@/constants/enums/Routes'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useUserStore from '@/stores/useUserStore'

import LayoutShapeLink from '@/components/common/UI/LayoutShapeLink'

const ResourcesButton = () => {
  const POIsWhereHidden = [
    SafeplacePOI.Outside,
    SafeplacePOI.OnBoarding,
    SafeplacePOI.Resources,
    SafeplacePOI.MountainColumn,
    SafeplacePOI.PlaceholderColumn1,
    SafeplacePOI.PlaceholderColumn2,
    SafeplacePOI.PlaceholderColumn3,
    SafeplacePOI.PlaceholderColumn4,
  ]

  const router = useUserStore((s) => s.router)

  const isCurrentlyAvailable = useSafeplaceStore(
    (state) => !POIsWhereHidden.includes(state.currentPOI)
  )

  return (
    <LayoutShapeLink
      className={`shape-link__resources ${
        isCurrentlyAvailable ? 'show' : 'hidden'
      }`}
    >
      <span
        className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 block pointer-events-auto cursor-pointer'
        onClick={() => router.push(Routes.Resources)}
      >
        <span className='block text-white text-xl'>Ressources</span>
      </span>
    </LayoutShapeLink>
  )
}

export default ResourcesButton
