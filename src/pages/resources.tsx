import { TransitionStatus } from 'react-transition-group'

import useTransitionStatus from '@/hooks/useTransitionStatus'

import ButtonShelterSafeplace from '@/components/Safeplace/UI/Buttons/ButtonShelterSafeplace'

const Resources = ({ status }: { status: TransitionStatus }) => {
  const show = useTransitionStatus(status)

  return (
    <>
      <ButtonShelterSafeplace show={show} direction='right' />
    </>
  )
}

export default Resources
