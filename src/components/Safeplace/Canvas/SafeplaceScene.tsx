import { forwardRef, RefObject } from 'react'

import SafeplaceSky from '@/components/Safeplace/Canvas/Decorations/SafeplaceSky'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import SafeplaceDebug from '@/components/Safeplace/Canvas/SafeplaceDebug'
import SafeplaceModel from '@/components/Safeplace/Canvas/SafeplaceModel'
import SafeplaceCamera from '@/components/Safeplace/Canvas/SafeplaceCamera'

const SafeplaceScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  return (
    <>
      <SafeplaceCamera ref={camRef} />

      <SafeplaceDebug />
      <SafeplaceSky />
      <SafeplaceModel />
    </>
  )
})

export default withScenePortal(SafeplaceScene)
