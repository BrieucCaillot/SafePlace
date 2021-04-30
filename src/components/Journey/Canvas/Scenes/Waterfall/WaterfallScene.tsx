import Waterfall from '@/components/canvas/Waterfall/Waterfall'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import JourneySky from '@/components/Journey/Canvas/Decorations/JourneySky'
import { useGLTF } from '@react-three/drei'
import React, { forwardRef, RefObject, useMemo } from 'react'
import WaterfallCamera from './WaterfallCamera'

const WaterfallScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const gltf = useGLTF('/models/journey/chapter3.glb')

  const [cameras, mountains, rocks, slats, waterfall] = useMemo(
    () => [...gltf.scene.children],
    []
  )

  const [camAnims, slatAnims] = useMemo(() => {
    const [cam1, cam2, cam3, ...slatsAnims] = gltf.animations
    return [[cam1, cam2, cam3], [...slatsAnims]]
  }, [])

  const cameraOffset = useMemo(() => cameras.position.toArray(), [])

  return (
    <>
      <group position={cameraOffset}>
        <WaterfallCamera clips={camAnims} ref={camRef} />
      </group>

      <JourneySky />

      <primitive object={mountains} />
      <primitive object={rocks} />
      <primitive object={slats} />
      <primitive object={waterfall} />

      <Waterfall scale={[7, 7, 7]} position={[-5.5, 0, 0]} />
    </>
  )
})

export default withScenePortal(WaterfallScene)
