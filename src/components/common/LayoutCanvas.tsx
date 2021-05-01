import { Canvas } from 'react-three-fiber'
import { Perf } from 'r3f-perf/dist/r3f-perf.cjs.development.js'
import { OrbitControls, Preload } from '@react-three/drei'
import { useControls } from 'leva'
import { ReactNode } from 'react'
import { NextRouter, withRouter } from 'next/router'
import Scenes from './Scenes/Scenes'
import ScenesRouting from './Scenes/ScenesRouting'
// enable shader editor
// import { MaterialEditor, useEditorComposer } from '@three-material-editor/react'

const LayoutCanvas = ({
  router,
  children,
}: {
  router: NextRouter
  children: ReactNode
}) => {
  const { orbitControls: enableOrbitControls, showPerf } = useControls({
    orbitControls: false,
    showPerf: false,
  })

  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
      }}
      colorManagement={true}
      pixelRatio={[devicePixelRatio, 2]}
    >
      {enableOrbitControls && <OrbitControls />}
      <Scenes />
      <ScenesRouting router={router} />

      <Preload all />
      {showPerf && (
        <Perf openByDefault trackGPU={true} position={'bottom-right'} />
      )}
      {children}
      {/* <MaterialEditor /> */}
      {/* <EffectComposer ref={useEditorComposer()}> */}
      {/* <EffectComposer>
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer> */}
    </Canvas>
  )
}

export default withRouter(LayoutCanvas)
