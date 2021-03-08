import { Suspense } from 'react'
import { Environment } from '@react-three/drei'

const BoxComponent = () => {
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <mesh rotation={[45, 45, 45]}>
        <icosahedronGeometry args={[1, 7]} />
        <meshStandardMaterial />
      </mesh>
      <Environment preset={'studio'} />
    </Suspense>
  )
}
export default BoxComponent
