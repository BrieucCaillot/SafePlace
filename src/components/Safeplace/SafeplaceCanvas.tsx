import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from 'react-three-fiber'
import { useControls } from 'leva'
import gsap from 'gsap'
import SafeplaceModel from '@/components/Safeplace/SafeplaceModel'
import useSafeplaceStore from '@/stores/useSafeplaceStore'

const SafeplaceCanvas = () => {
  const { camPos } = useControls('Camera position', {
    camPos: [0, 6, 50],
  })

  const { camera } = useThree()

  const insideHouseRef = useRef<THREE.Mesh | null>(null)

  useEffect(() => {
    camera.position.set(camPos[0], camPos[1], camPos[2])
  }, [camPos])

  // const moveInside = useSafeplaceStore((state) => {
  //   state.moveInside(camera.position)
  // })

  return (
    <>
      <Suspense fallback={null}>
        <pointLight position={[0, 20, 0]} />
        <mesh ref={insideHouseRef} position={[0, 4, 0]}>
          <boxGeometry />
          <meshNormalMaterial />
        </mesh>
        <SafeplaceModel />
      </Suspense>
    </>
  )
}

export default SafeplaceCanvas
