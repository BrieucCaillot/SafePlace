import Routes from '@/constants/enums/Routes'

import ButtonShapeLink from '@/components/common/UI/Buttons/ButtonShapeLink'
import useJourneyStore from '@/stores/useJourneyStore'

const LayoutShelterButton = ({ to }: { to: Routes }) => {
  const showShelterButton = useJourneyStore((s) => s.showShelterButton)

  return (
    <ButtonShapeLink
      className={`shape-link__shelter py-1.5 px-5 text-white ${
        showShelterButton ? 'fadeIn' : 'invisible'
      }`}
      route={to}
    >
      Abri
    </ButtonShapeLink>
  )
}

export default LayoutShelterButton
