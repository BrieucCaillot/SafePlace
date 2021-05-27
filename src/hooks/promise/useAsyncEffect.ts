import { useEffect } from 'react'
import useDropPromise from './useDropPromise'

const useAsyncEffect = (
  asyncMethod: (
    wrap: ReturnType<typeof useDropPromise>['wrap']
  ) => Promise<void>,
  returnMethod: () => void = () => {},
  deps: any[] = []
) => {
  const { drop, wrap } = useDropPromise()

  useEffect(() => {
    asyncMethod(wrap)

    return () => {
      drop()
      returnMethod()
    }
  }, deps)
}

export default useAsyncEffect
