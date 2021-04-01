import * as THREE from 'three'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { Perf } from 'r3f-perf'
import { OrbitControls, Preload } from '@react-three/drei'
import { useControls } from 'leva'
// enable shader editor
// import { MaterialEditor, useEditorComposer } from '@three-material-editor/react'

const LayoutCanvas = ({ children }) => {
  const { orbitControlsEnabled } = useControls('Camera', {
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
      onCreated={({ gl, camera }) => {
        camera.name = 'Camera'
        gl.setClearColor(0xffffff, 1)
      }}
    >
      <Preload all />
      {orbitControlsEnabled && <OrbitControls />}
      <Perf openByDefault trackGPU={true} position={'bottom-right'} />
      {/* <MaterialEditor /> */}
      {/* <EffectComposer ref={useEditorComposer()}> */}
      {/* <EffectComposer>
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer> */}
      {children}
    </Canvas>
  )
}

export default LayoutCanvas
