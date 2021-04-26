import withScenePortal from '@/components/common/Scenes/withScenePortal'
import JourneySky from '@/components/Journey/Canvas/Decorations/JourneySky'
import React from 'react'

const IntroScene = () => {
  return (
    <>
      <JourneySky />
      <mesh rotation={[Math.PI / 2, Math.PI / 2, 0]}>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  )
}

export default withScenePortal(IntroScene)
