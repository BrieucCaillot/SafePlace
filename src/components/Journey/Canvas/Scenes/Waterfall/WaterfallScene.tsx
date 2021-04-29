import Waterfall from '@/components/canvas/Waterfall/Waterfall'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import JourneySky from '@/components/Journey/Canvas/Decorations/JourneySky'
import { useGLTF } from '@react-three/drei'
import React, { forwardRef, RefObject, useEffect } from 'react'
import WaterfallCamera from './WaterfallCamera'

const WaterfallScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const gltf = useGLTF('/models/journey/chapter3.glb')

  return (
    <>
      <WaterfallCamera ref={camRef} />
      <JourneySky />
      <primitive object={gltf.scene} />
      <Waterfall scale={[7, 7, 7]} position={[-5.5, 0, 0]} />
      <directionalLight position={[1, 2, 1]} intensity={0.7} />
      <directionalLight position={[-1, 2, 1]} intensity={0.5} />
    </>
  )
})

export default withScenePortal(WaterfallScene)
