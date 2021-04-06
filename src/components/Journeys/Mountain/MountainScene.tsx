import { Suspense, useEffect } from 'react'

import SafeplaceSky from '@/components/Safeplace/SafeplaceSky'
import Waterfall from '@/components/canvas/Waterfall/Waterfall'
import Rocks from './Rocks'
import { useThree } from 'react-three-fiber'

const MountainScene = () => {
  return (
    <Suspense fallback={null}>
      {/* <SafeplaceSky /> */}
      {/* <Waterfall position={[0, 0, 0]} /> */}
      {/* <pointLight position={[0, 20, 0]} /> */}

      {/* <Rocks position={[0, -5, 0]} scale={[0.05, 0.05, 0.05]} /> */}
      {/* <mesh
        name={'Mountain Ground'}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[500, 500, 32, 32]} />
        <meshBasicMaterial color={'#4e4e4a'} />
      </mesh> */}
    </Suspense>
  )
}

export default MountainScene
