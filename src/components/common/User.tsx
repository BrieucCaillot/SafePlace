import { useEffect } from 'react'
import { useControls } from 'leva'

import useUserStore from '@/stores/useUserStore'

const User = (): null => {
  const [{ clearLocalStorage }, set] = useControls(() => ({
    clearLocalStorage: false,
  }))

  useEffect(() => {
    if (!clearLocalStorage) return
    window.localStorage.clear()
  }, [clearLocalStorage])

  useEffect(() => {
    const {
      getUserFirstConnection,
      setUserFirstConnection,
      getIsJourneyCompleted,
      setIsJourneyCompleted,
    } = useUserStore.getState()

    setUserFirstConnection(getUserFirstConnection())
    setIsJourneyCompleted(getIsJourneyCompleted())
  }, [])

  return null
}

export default User
