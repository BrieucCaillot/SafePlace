import shallow from 'zustand/shallow'
import React, { Fragment, Suspense } from 'react'
import { Camera, useFrame } from 'react-three-fiber'
import useSceneStore from '@/stores/useSceneStore'

const Scenes = () => {
  const renderedSceneData = useSceneStore((s) =>
    s.renderedScene ? s.scenesData[s.renderedScene] : null
  )
  const mountedSceneData = useSceneStore(
    (s) => s.mountedScenes.map((name) => s.scenesData[name]),
    shallow
  )

  useFrame(({ gl, camera, setDefaultCamera }) => {
    if (renderedSceneData === null) return

    const { cameraRef, scene } = renderedSceneData

    if (cameraRef.current == null) return
    if (cameraRef.current !== camera)
      setDefaultCamera(cameraRef.current as Camera)

    gl.autoClear = true
    gl.render(scene, cameraRef.current)
  }, 100)

  return (
    <>
      {mountedSceneData.map(({ Component, scene, cameraRef }, i) => (
        <Fragment key={scene.uuid}>
          <Suspense fallback={'loading'}>
            <Component scene={scene} ref={cameraRef} />
          </Suspense>
        </Fragment>
      ))}
    </>
  )
}

export default React.memo(Scenes)
