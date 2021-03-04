import { TransformControls } from '@react-three/drei'
import { RefObject, useEffect, useLayoutEffect } from 'react'

const useLogTransformControls = (
  property: string,
  refControls: RefObject<TransformControls>
) => {
  useLayoutEffect(() => {
    const update = () => {
      console.log(refControls.current?.object?.position.toArray())
    }
    ;(refControls.current?.addEventListener as any)(
      `${property}-changed`,
      update
    )
    return () =>
      (refControls.current?.removeEventListener as any)(
        `${property}-changed`,
        update
      )
  }, [])
}

export default useLogTransformControls
