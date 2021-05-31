import { TransitionStatus } from 'react-transition-group'

import useTransitionStatus from '@/hooks/useTransitionStatus'

import ButtonShelterSafeplace from '@/components/Safeplace/UI/Buttons/ButtonShelterSafeplace'

const Resources = ({ status }: { status: TransitionStatus }) => {
  const show = useTransitionStatus(status)

  return (
    <div className={`fixed top-screen-h/2 flex justify-end w-full `}>
      <ButtonShelterSafeplace show={show} direction='right' />
    </div>
  )
}

export default Resources
