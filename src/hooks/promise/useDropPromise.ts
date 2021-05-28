import { useCallback, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const useDropPromise = () => {
  const id = useRef<string>(uuidv4())

  const drop = useCallback(() => {
    id.current = uuidv4()
  }, [])

  const wrap = useCallback(<T>(p: Promise<T>) => {
    const wrapperId = id.current
    return new Promise<T>((res) =>
      p.then((...args) => wrapperId === id.current && res(...args))
    )
  }, [])

  return { drop, wrap }
}

export default useDropPromise
