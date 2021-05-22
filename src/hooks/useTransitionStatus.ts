import { useEffect, useRef, useState } from 'react'
import { TransitionStatus } from 'react-transition-group'

const useTransitionStatus = (status: TransitionStatus) => {
  const prevStatus = useRef<TransitionStatus>()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (status === prevStatus.current) return
    prevStatus.current = status
    if (['entered'].includes(status)) {
      setShow(true)
    }
    if (['exiting', 'exited'].includes(status)) {
      setShow(false)
    }
  }, [status])

  return show
}

export default useTransitionStatus
