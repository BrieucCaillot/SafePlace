import { useEffect } from 'react'
import { useControls } from 'leva'

import useUserStore from '@/stores/useUserStore'

const User = (): null => {
  useControls({
    clearStorage: {
      type: 'BUTTON',
      value: false,
      onClick: () => {
        window.localStorage.clear()
      },
    },
  })

  useEffect(() => {
    const {
      getUserFirstConnection,
      setUserFirstConnection,
      getIsJourneyCompleted,
      setIsJourneyCompleted,
    } = useUserStore.getState()

    setUserFirstConnection(true)
    setIsJourneyCompleted(true)
    // COMMENT FOR THE DEMO
    // setUserFirstConnection(getUserFirstConnection())
    // setIsJourneyCompleted(getIsJourneyCompleted())
  }, [])

  return null
}

export default User
