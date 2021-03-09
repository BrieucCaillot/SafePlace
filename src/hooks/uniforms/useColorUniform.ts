import { useEffect } from 'react'
import * as THREE from 'three'

const useColorUniform = (
  uniform: THREE.IUniform,
  color: Parameters<typeof THREE.Color.prototype.set>[0]
) => {
  useEffect(() => {
    uniform.value = new THREE.Color(color)
  }, [color])
}

export default useColorUniform
