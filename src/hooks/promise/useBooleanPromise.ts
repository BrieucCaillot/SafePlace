import { useCallback, useState } from 'react'

const useBooleanPromise = () => {
  const [resolveFunc, setResolveFunc] = useState<() => void>(null)
  const [isWaiting, setIsWaiting] = useState(false)

  const resolve = useCallback(() => {
    setIsWaiting(false)
    if (resolveFunc !== null) resolveFunc()
  }, [resolveFunc])

  const wait = useCallback(() => {
    setIsWaiting(true)
    return new Promise<void>((res) => {
      setResolveFunc(() => res)
    })
  }, [])

  return { isWaiting, wait, resolve }
}

export default useBooleanPromise
