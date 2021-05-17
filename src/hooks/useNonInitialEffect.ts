import { useEffect, useRef } from 'react'

const useNonInitialEffect = (cb: () => void, deps: any[]) => {
  const firstRender = useRef<boolean>(true)

  useEffect(() => {
    if (!firstRender.current) return cb()
    else firstRender.current = false
  }, deps)
}

export default useNonInitialEffect
