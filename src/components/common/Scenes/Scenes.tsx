import shallow from 'zustand/shallow'
import React, { Fragment, RefObject, Suspense, useEffect } from 'react'
import { Camera, useFrame, useThree } from 'react-three-fiber'
import useSceneStore from '@/stores/useSceneStore'

const Scenes = () => {
  const { setDefaultCamera } = useThree()

  const renderedSceneData = useSceneStore((s) =>
    s.renderedScene ? s.scenesData[s.renderedScene] : null
  )
  const mountedSceneData = useSceneStore(
    (s) => s.mountedScenes.map((name) => s.scenesData[name]),
    shallow
  )

  useEffect(() => {
    if (renderedSceneData === null) return
    const { cameraRef } = renderedSceneData
    if (cameraRef.current == undefined) throw `No camera for rendered scene`
    setDefaultCamera(cameraRef.current as Camera)
  }, [renderedSceneData])

  useFrame(({ gl }) => {
    if (renderedSceneData === null) return

    const { cameraRef, scene } = renderedSceneData

    if (cameraRef.current == null) return

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
