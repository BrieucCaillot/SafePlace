import { TransitionStatus } from 'react-transition-group'

import ButtonShelterSafeplace from '@/components/Safeplace/UI/Buttons/ButtonShelterSafeplace'

import useTransitionStatus from '@/hooks/useTransitionStatus'

const MountainColumn = ({ status }: { status: TransitionStatus }) => {
  const show = useTransitionStatus(status)

  return (
    <>
      <ButtonShelterSafeplace show={show} direction='left' />
    </>
  )
}

export default MountainColumn
