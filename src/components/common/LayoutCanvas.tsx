import { Canvas } from 'react-three-fiber'
import { Perf } from 'r3f-perf/dist/r3f-perf.cjs.development.js'
import { OrbitControls, Preload } from '@react-three/drei'
import { useControls } from 'leva'
import { ReactNode, useEffect } from 'react'
import { NextRouter, withRouter } from 'next/router'
import Scenes from './Scenes/Scenes'
import useSceneStore, { SceneName } from '@/stores/useSceneStore'
import usePrevious from '@/hooks/usePrevious'
// enable shader editor
// import { MaterialEditor, useEditorComposer } from '@three-material-editor/react'

const LayoutCanvas = ({
  router: { pathname },
  children,
}: {
  router: NextRouter
  children: ReactNode
}) => {
  const { orbitControls: enableOrbitControls, showPerf } = useControls({
    orbitControls: false,
    showPerf: true,
  })
  const previousPathname = usePrevious(pathname)

  useEffect(() => {
    const {
      mountScene,
      setRenderedScene,
      unmountAllScenes,
    } = useSceneStore.getState()

    if (pathname === '/safeplace') {
      mountScene(SceneName.Safeplace)
      setRenderedScene(SceneName.Safeplace)
    }

    if (pathname === '/') {
      unmountAllScenes()
      setRenderedScene(null)
    }

    if (pathname === '/journey') {
      mountScene(SceneName.Lake)
      setRenderedScene(SceneName.Lake)
    }
  }, [pathname])

  useEffect(() => {
    const { unmountScene } = useSceneStore.getState()
    if (pathname == previousPathname) return
    if (previousPathname === '/journey') {
      unmountScene(SceneName.Lake)
    }
  }, [previousPathname, pathname])

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
