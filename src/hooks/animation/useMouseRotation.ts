import { RefObject, useEffect, useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'

const useMouseRotation = (
  objectRef: RefObject<THREE.Object3D>,
  {
    amplitude = 0.02,
    easing = 0.02,
    offset = [0, 0, 0],
    enable = true,
  }: {
    amplitude?: number
    easing?: number
    offset?: [number, number, number]
    enable?: boolean
  } = {}
) => {
  const newMousePos = useRef(new THREE.Vector2())
  const lastMousePos = useRef(new THREE.Vector2())

  useEffect(() => {
    if (!enable) return
    const handleMouse = (e: MouseEvent) => {
      newMousePos.current
        .set(
          -((e.clientY / window.innerHeight) * 2 - 1),
          -((e.clientX / window.innerWidth) * 2 - 1)
        )
        .multiplyScalar(amplitude)
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [amplitude, enable])

  useFrame(() => {
    if (objectRef.current == null || !enable) return
    lastMousePos.current.lerp(newMousePos.current, easing)
    objectRef.current.rotation.set(
      lastMousePos.current.x + offset[0],
      lastMousePos.current.y + offset[1],
      0 + offset[2]
    )
  })
}

export default useMouseRotation
