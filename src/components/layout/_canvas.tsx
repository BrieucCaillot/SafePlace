import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { Perf } from 'r3f-perf'
import { OrbitControls, Preload } from '@react-three/drei'
import { EffectComposer, Vignette } from '@react-three/postprocessing'
import useRAFStore from '@/stores/useRAFStore'
// enable shader editor
// import { MaterialEditor, useEditorComposer } from '@three-material-editor/react'

const RAF = () => {
  const execRaf = useRAFStore((s) => s.execRaf)
  useFrame(execRaf)

  return null
}

const LCanvas = ({ children }) => {
  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
      }}
      colorManagement={false}
    >
      <RAF />
      <Preload all />
      <Perf openByDefault trackGPU={true} position={'bottom-right'} />
      <OrbitControls />
      {/* <MaterialEditor /> */}
      {/* <EffectComposer ref={useEditorComposer()}> */}
      <EffectComposer>
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
      {children}
    </Canvas>
  )
}

export default LCanvas
