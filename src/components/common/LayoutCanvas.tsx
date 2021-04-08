import { Canvas } from 'react-three-fiber'
import { Perf } from 'r3f-perf/dist/r3f-perf.cjs.development.js'
import { OrbitControls, Preload } from '@react-three/drei'
import { useControls } from 'leva'
import { useEffect } from 'react'
import Scenes from './Scenes/Scenes'
import { useRouter } from 'next/router'
import useSceneStore, { SceneName } from '@/stores/useSceneStore'
// enable shader editor
// import { MaterialEditor, useEditorComposer } from '@three-material-editor/react'

const LayoutCanvas = () => {
  const { orbitControlsEnabled } = useControls('camera', {
    orbitControlsEnabled: false,
  })

  const { r3fActive } = useControls('r3f', {
    r3fActive: true,
  })

  const mountScene = useSceneStore((s) => s.mountScene)
  const setRenderedScene = useSceneStore((s) => s.setRenderedScene)

  const { pathname } = useRouter()
  useEffect(() => {
    if (pathname === '/safeplace') {
      mountScene(SceneName.Safeplace)
      setRenderedScene(SceneName.Safeplace)
    }
  }, [pathname])

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
      {r3fActive && (
        <Perf openByDefault trackGPU={true} position={'bottom-right'} />
      )}
      {/* <MaterialEditor /> */}
      {/* <EffectComposer ref={useEditorComposer()}> */}
      {/* <EffectComposer>
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer> */}
    </Canvas>
  )
}

export default LayoutCanvas
