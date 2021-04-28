import Waterfall from '@/components/canvas/Waterfall/Waterfall'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import JourneySky from '@/components/Journey/Canvas/Decorations/JourneySky'
import { useGLTF } from '@react-three/drei'
import React, { useRef } from 'react'
import WaterfallModel from '../../WaterfallModel'

const WaterfallScene = () => {
  return (
    <>
      <JourneySky />
      <WaterfallModel />

      <Waterfall scale={[0.1, 0.1, 0.1]} position={[0.1, -0.07, -0.12]} />
      <directionalLight position={[1, 2, 1]} intensity={0.7} />
      <directionalLight position={[-1, 2, 1]} intensity={0.5} />
    </>
  )
}

export default withScenePortal(WaterfallScene)
