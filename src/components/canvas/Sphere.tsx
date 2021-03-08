import { Suspense, useRef } from 'react'
import { Environment, Sphere } from '@react-three/drei'
import { useControls } from 'leva'
import useAnimateVector from '@/hooks/animation/useAnimateVector'

const SphereComponent = () => {
  const { toggle, ...matProps } = useControls('Sphere material', {
    metalness: { value: 0.5, min: 0, max: 1 },
    roughness: { value: 0.5, min: 0, max: 1 },
    color: '#fff',
    toggle: true,
  })

  const meshRef = useRef<THREE.Mesh>()
  useAnimateVector(
    { ref: meshRef, target: 'scale' },
    toggle ? [1, 1, 1] : [0.5, 0.5, 0.5],
    { duration: 0.7 }
  )

  return (
    <>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <Sphere args={[1, 32, 32]} ref={meshRef}>
          <meshStandardMaterial {...matProps} />
        </Sphere>
        <Environment preset={'studio'} />
      </Suspense>
    </>
  )
}

export default SphereComponent
