import { forwardRef, RefObject, useEffect } from 'react'

import withScenePortal from '@/components/common/Scenes/withScenePortal'
import SafeplaceDebug from '@/components/Safeplace/Canvas/SafeplaceDebug'
import SafeplaceModel from '@/components/Safeplace/Canvas/SafeplaceModel'
import SafeplaceCamera from '@/components/Safeplace/Canvas/SafeplaceCamera'
import CustomSky from '@/components/canvas/Sky/CustomSky'

const SafeplaceScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  return (
    <>
      <SafeplaceCamera ref={camRef} />

      <SafeplaceDebug />
      <CustomSky />
      <SafeplaceModel />
    </>
  )
})

export default withScenePortal(SafeplaceScene)
