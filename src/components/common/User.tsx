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

  const isFirstConnection = useMemo(() => {
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
    // setUserFirstConnection(isFirstConnection)
    // FOR USER TEST
    setUserFirstConnection('false')
  }, [])

  return null
}

export default User
