import Routes from '@/constants/enums/Routes'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import useSafeplaceStore from '@/stores/useSafeplaceStore'

import ButtonShapeLink from '@/components/common/UI/Buttons/ButtonShapeLink'

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

  const isCurrentlyAvailable = useSafeplaceStore(
    (state) => !POIsWhereHidden.includes(state.currentPOI)
  )

  return (
    <ButtonShapeLink
      className={`shape-link__resources px-5 py-1.5 text-white ${
        isCurrentlyAvailable ? 'show' : 'hidden'
      }`}
      route={Routes.Resources}
    >
      Ressources
    </ButtonShapeLink>
  )
}

export default ResourcesButton
