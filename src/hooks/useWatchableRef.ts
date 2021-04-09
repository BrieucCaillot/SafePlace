import {
  MutableRefObject,
  RefObject,
  useCallback,
  useMemo,
  useRef,
} from 'react'

export type WatchableRefObject<T> = MutableRefObject<T | null | undefined> & {
  onChange: (callback: (value: T | null | undefined) => void) => () => void
}

const useWatchableRef = <T>(defaultValue: T) => {
  const ref = useRef<T>(defaultValue)

  const callbackArray = useRef<((v: T) => void)[]>([])

  const onChangeCallback = useCallback<
    (callback: (value: T | null | undefined) => void) => () => void
  >((callback) => {
    callbackArray.current.push(callback)
    return () => {
      const index = callbackArray.current.indexOf(callback)
      if (index > -1) callbackArray.current.splice(index, 1)
    }
  }, [])

  const watchableRef = useMemo(() => {
    const editedRef: WatchableRefObject<T> = {
      ...ref,
      onChange: onChangeCallback,
    }
    const handler: ProxyHandler<WatchableRefObject<T>> = {
      set: (object, property: 'current', value: T) => {
        object[property] = value
        for (const callback of callbackArray.current) callback(value)
        return true
      },
    }
    return new Proxy(editedRef, handler)
  }, [])

  return watchableRef
}

export default useWatchableRef
