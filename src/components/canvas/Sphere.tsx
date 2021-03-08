import { Suspense } from 'react'
import { Environment, Sphere } from '@react-three/drei'

const SphereComponent = () => {
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial />
      </Sphere>
      <Environment preset={'studio'} />
    </Suspense>
  )
}

export default SphereComponent
