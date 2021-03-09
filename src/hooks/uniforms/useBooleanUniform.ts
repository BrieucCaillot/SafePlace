import { useEffect } from 'react'

const useBooleanUniform = (uniform: THREE.IUniform, value: boolean) => {
  useEffect(() => {
    uniform.value = value
  }, [value])
}

export default useBooleanUniform
