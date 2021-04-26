import withScenePortal from '@/components/common/Scenes/withScenePortal'
import JourneySky from '@/components/Journey/Canvas/Decorations/JourneySky'
import React from 'react'

const LakeScene = () => {
  return (
    <>
      <JourneySky />
      <mesh>
        <icosahedronGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  )
}

export default withScenePortal(LakeScene)
