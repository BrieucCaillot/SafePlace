import { useEffect } from 'react'
import * as THREE from 'three'

function useUniform(uniform: THREE.IUniform, value: any) {
  useEffect(() => {
    uniform.value = value
  }, [value])
}

export default useUniform
