import { Canvas } from 'react-three-fiber'
import { Perf } from 'r3f-perf/dist/r3f-perf.cjs.development.js'
import { OrbitControls, Preload } from '@react-three/drei'
import { useControls } from 'leva'
import SafeplaceScene from '../Safeplace/Canvas/SafeplaceScene'
import { ReactNode, Suspense } from 'react'
import SafeplaceCamera from '../Safeplace/Canvas/SafeplaceCamera'
import Scenes from './Scenes/Scenes'
// enable shader editor
// import { MaterialEditor, useEditorComposer } from '@three-material-editor/react'

const LayoutCanvas = () => {
  const { orbitControlsEnabled } = useControls('camera', {
    orbitControlsEnabled: false,
  })

  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
      }}
      colorManagement={false}
      pixelRatio={[devicePixelRatio, 2]}
    >
      <Scenes />

      <Preload all />
      {orbitControlsEnabled && <OrbitControls />}
      <Perf openByDefault trackGPU={true} position={'bottom-right'} />
      {/* <MaterialEditor /> */}
      {/* <EffectComposer ref={useEditorComposer()}> */}
      {/* <EffectComposer>
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer> */}
    </Canvas>
  )
}

export default LayoutCanvas
