import { useEffect, useMemo } from 'react'
import { useControls } from 'leva'

import useUserStore from '@/stores/useUserStore'

const User = (): null => {
  const getUserFirstConnection = useUserStore(
    (state) => state.getUserFirstConnection
  )
  const setUserFirstConnection = useUserStore(
    (state) => state.setUserFirstConnection
  )

  const userStatus = useMemo(() => {
    return getUserFirstConnection() == null ? 'true' : 'false'
  }, [])

  const [{ clearLocalStorage }, set] = useControls(() => ({
    clearLocalStorage: false,
  }))

  useEffect(() => {
    if (!clearLocalStorage) return
    window.localStorage.clear()
  }, [clearLocalStorage])

  useEffect(() => {
    setUserFirstConnection(userStatus)
  }, [])

  return null
}

export default User
