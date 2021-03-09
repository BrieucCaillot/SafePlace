import { useEffect } from 'react'
import * as THREE from 'three'

function useNumberUniform(uniform: THREE.IUniform, value: number) {
  useEffect(() => {
    uniform.value = value
  }, [value])
}

export default useNumberUniform
