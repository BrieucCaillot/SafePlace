import { useMemo } from 'react'
import { TransitionStatus } from 'react-transition-group'

const useTransitionStatus = (status: TransitionStatus) => {
  return useMemo(() => 'entered' === status, [status])
}

export default useTransitionStatus
