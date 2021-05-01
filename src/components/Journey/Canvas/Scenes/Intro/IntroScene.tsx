import ClassicCamera from '@/components/common/Canvas/ClassicCamera'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import JourneySky from '@/components/Journey/Canvas/Decorations/JourneySky'
import React, { forwardRef, RefObject } from 'react'

const IntroScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  return (
    <>
      <ClassicCamera ref={camRef} />
      <JourneySky />
      <mesh rotation={[Math.PI / 2, Math.PI / 2, 0]}>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  )
})

export default withScenePortal(IntroScene)
