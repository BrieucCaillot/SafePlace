import { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'

const Box = () => {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (ref.current === null) return
    ref.current.rotation.x = clock.getElapsedTime() / 5
    ref.current.rotation.y = clock.getElapsedTime() / 10
  })

  return (
    <mesh ref={ref}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  )
}

export default Box
