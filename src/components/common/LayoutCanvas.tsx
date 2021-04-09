import { Canvas } from 'react-three-fiber'
import { Perf } from 'r3f-perf/dist/r3f-perf.cjs.development.js'
import { OrbitControls, Preload } from '@react-three/drei'
import { useControls } from 'leva'
import { useEffect } from 'react'
import { NextRouter, withRouter } from 'next/router'
import Scenes from './Scenes/Scenes'
import useSceneStore, { SceneName } from '@/stores/useSceneStore'
import usePrevious from '@/hooks/usePrevious'
// enable shader editor
// import { MaterialEditor, useEditorComposer } from '@three-material-editor/react'

const LayoutCanvas = ({ router: { pathname } }: { router: NextRouter }) => {
  const { orbitControls, showPerf } = useControls({
    orbitControls: false,
    showPerf: true,
  })

  const mountScene = useSceneStore((s) => s.mountScene)
  const unmountScene = useSceneStore((s) => s.unmountScene)
  const unmountAllScenes = useSceneStore((s) => s.unmountAllScenes)
  const setRenderedScene = useSceneStore((s) => s.setRenderedScene)
  const previousPathname = usePrevious(pathname)

  useEffect(() => {
    if (pathname === '/safeplace') {
      mountScene(SceneName.Safeplace)
      setRenderedScene(SceneName.Safeplace)
    }

    if (pathname === '/') {
      unmountAllScenes()
      setRenderedScene(null)
    }

    if (pathname === '/journey') {
      mountScene(SceneName.Journey)
      setRenderedScene(SceneName.Journey)
    }
  }, [pathname])

  useEffect(() => {
    if (previousPathname === '/journey') {
      unmountScene(SceneName.Journey)
    }
  }, [previousPathname])

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
      {orbitControls && <OrbitControls />}
      {showPerf && (
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

export default withRouter(LayoutCanvas)
