import ClassicCamera from '@/components/common/Canvas/ClassicCamera'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import JourneySky from '@/components/Journey/Canvas/Decorations/JourneySky'
import React, { forwardRef, RefObject } from 'react'

const CairnsScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  return (
    <>
      <ClassicCamera ref={camRef} />
      <JourneySky />
      <mesh>
        <coneGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  )
})

export default withScenePortal(CairnsScene)
