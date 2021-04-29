import withScenePortal from '@/components/common/Scenes/withScenePortal'
import JourneySky from '@/components/Journey/Canvas/Decorations/JourneySky'
import React, { forwardRef, RefObject } from 'react'
import ClassicCamera from '@/components/common/Canvas/ClassicCamera'

const LakeScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  return (
    <>
      <ClassicCamera ref={camRef} />
      <JourneySky />
      <mesh>
        <icosahedronGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  )
})

export default withScenePortal(LakeScene)
