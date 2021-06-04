import { TransitionStatus } from 'react-transition-group'

import ButtonShelterSafeplace from '@/components/Safeplace/UI/Buttons/ButtonShelterSafeplace'

import useTransitionStatus from '@/hooks/animation/useTransitionStatus'

const BridgeColumn = ({ status }: { status: TransitionStatus }) => {
  const show = useTransitionStatus(status)

  return (
    <>
      <div className={`fixed top-screen-h/2 flex justify-start w-full `}>
        <ButtonShelterSafeplace show={show} direction='left' />
      </div>
    </>
  )
}

export default BridgeColumn
