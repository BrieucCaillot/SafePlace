import * as THREE from 'three'
import { Canvas } from 'react-three-fiber'
import { Perf } from 'r3f-perf'
import { OrbitControls, Preload } from '@react-three/drei'
import { EffectComposer, Vignette } from '@react-three/postprocessing'
import { useControls } from 'leva'
import Camera from '@/components/Camera/Camera'
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
      onCreated={({ gl }) => {
        gl.setClearColor(0xffffff, 1)
      }}
    >
      <Camera />
      <Preload all />
      <Perf openByDefault trackGPU={true} position={'bottom-right'} />
      {orbitControlsEnabled && <OrbitControls />}
      {/* <MaterialEditor /> */}
      {/* <EffectComposer ref={useEditorComposer()}> */}
      <EffectComposer>
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
      {children}
    </Canvas>
  )
}

export default LayoutCanvas
