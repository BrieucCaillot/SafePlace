import useSavePOIData from '@/hooks/POI/useSavePOIData'
import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import { useFBO } from '@react-three/drei'
import { useControls } from 'leva'
import { useEffect } from 'react'
import { GroupProps } from 'react-three-fiber'
import * as THREE from 'three'
import WaterfallFBO from './WaterfallFBO/WaterfallFBO'

const Waterfall = ({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
  ...props
}: GroupProps) => {
  const [controlProps] = useControls('Controls', () => ({
    position: position as THREE.Vector3Tuple,
    scale: scale as THREE.Vector3Tuple,
    rotation: rotation as THREE.Vector3Tuple,
  }))

  const fbo = useFBO(64, 64, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
  })
  const savePOI = useSavePOIData(SafeplacePOI.Waterfall)

  return (
    <group {...controlProps} {...props}>
      <mesh scale={[5, 5, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={fbo.texture} />
      </mesh>
      <group position-z={6} ref={savePOI} />
      <WaterfallFBO fbo={fbo} />
    </group>
  )
}

export default Waterfall
