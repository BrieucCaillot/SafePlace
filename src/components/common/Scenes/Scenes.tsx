import useSceneStore from '@/stores/useSceneStore'
import shallow from 'zustand/shallow'
import { Fragment, RefObject, Suspense, useEffect } from 'react'
import { Camera, useFrame, useThree } from 'react-three-fiber'

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

    if (cameraRef.current == undefined) return

    gl.autoClear = true
    gl.render(scene, cameraRef.current)
  }, 100)

  return (
    <>
      {mountedSceneData.map(
        ({ Component, scene, CameraComponent, cameraRef }, i) => (
          <Fragment key={i}>
            <Suspense fallback={'loading'}>
              <Component scene={scene} />
            </Suspense>
            <CameraComponent ref={cameraRef as RefObject<Camera>} />
          </Fragment>
        )
      )}
    </>
  )
}

export default Scenes
