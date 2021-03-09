import { useEffect } from 'react'
import * as THREE from 'three'

const useVector3Uniform = (
  uniform: THREE.IUniform,
  value:
    | [number, number, number]
    | THREE.Vector3
    | { x: number; y: number; z: number }
) => {
  useEffect(() => {
    const numberArray = 'x' in value ? [value.x, value.y, value.z] : value
    uniform.value.set(...numberArray)
  }, [value])
}

export default useVector3Uniform
