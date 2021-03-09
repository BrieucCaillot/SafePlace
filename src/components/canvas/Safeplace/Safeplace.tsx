import { Suspense, useRef } from 'react'
import { Box } from '@react-three/drei'
import { useControls } from 'leva'
import useAnimateVector from '@/hooks/animation/useAnimateVector'
import * as THREE from 'three'

const Safeplace = () => {
  return (
    <Suspense fallback={null}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshNormalMaterial />
      </mesh>
    </Suspense>
  )
}

export default Safeplace
