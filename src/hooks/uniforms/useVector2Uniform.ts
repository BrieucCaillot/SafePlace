import { useEffect } from 'react'
import * as THREE from 'three'

const useVector2Uniform = (
  uniform: THREE.IUniform,
  value: [number, number] | THREE.Vector2 | { x: number; y: number }
) => {
  useEffect(() => {
    const numberArray = 'x' in value ? [value.x, value.y] : value
    uniform.value.set(...numberArray)
  }, [value])
}

export default useVector2Uniform
