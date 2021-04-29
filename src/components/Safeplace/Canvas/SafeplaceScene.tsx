import SafeplaceSky from '@/components/Safeplace/Canvas/Decorations/SafeplaceSky'
import Waterfall from '@/components/canvas/Waterfall/Waterfall'
import Grass from '@/components/Safeplace/Canvas/Decorations/Grass/Grass'
import Dandelion from '@/components/canvas/Dandelion/Dandelion'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import SafeplaceDebug from '@/components/Safeplace/Canvas/SafeplaceDebug'
import SafeplaceModel from '@/components/Safeplace/Canvas/SafeplaceModel'
import { forwardRef, RefObject } from 'react'
import SafeplaceCamera from './SafeplaceCamera'

const SafeplaceScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  return (
    <>
      <SafeplaceCamera ref={camRef} />

      <SafeplaceDebug />
      <SafeplaceSky />
      <SafeplaceModel />
      {/* <Waterfall position={[-50, 6, 0]} rotation={[0, 45, 0]} />
      <Dandelion position={[50, 6, 0]} rotation={[0, -45, 0]} /> */}

      <ambientLight />
    </>
  )
})

export default withScenePortal(SafeplaceScene)
