import withScenePortal from '@/components/common/Scenes/withScenePortal'
import JourneySky from '@/components/Journey/Canvas/Decorations/JourneySky'
import React from 'react'

const CairnsScene = () => {
  return (
    <>
      <JourneySky />
      <mesh>
        <coneGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  )
}

export default withScenePortal(CairnsScene)
