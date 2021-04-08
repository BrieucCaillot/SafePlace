import { useControls } from 'leva'
import {
  createRef,
  ExoticComponent,
  FC,
  Fragment,
  RefObject,
  Suspense,
  useEffect,
  useMemo,
} from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import SafeplaceCamera from '../../Safeplace/Canvas/SafeplaceCamera'
import SafeplaceScene from '../../Safeplace/Canvas/SafeplaceScene'
import { WithScenePortalProps } from './withScenePortal'

type SceneData = {
  Component: FC<WithScenePortalProps>
  scene: THREE.Scene
  CameraComponent: ExoticComponent<{ ref: RefObject<THREE.Camera> }>
  cameraRef: RefObject<THREE.Camera>
}

enum SceneName {
  Safeplace,
}

const Scenes = () => {
  const { setDefaultCamera } = useThree()
  const mountedScenes: SceneName[] = [SceneName.Safeplace]
  const renderedScene: SceneName | null = SceneName.Safeplace

  const scenesData: Record<SceneName, SceneData> = useMemo(
    () => ({
      [SceneName.Safeplace]: {
        Component: SafeplaceScene,
        scene: new THREE.Scene(),
        CameraComponent: SafeplaceCamera,
        cameraRef: createRef(),
      },
    }),
    []
  )

  const mountedSceneData = useMemo(
    () => mountedScenes.map((s) => scenesData[s]),
    [mountedScenes]
  )

  useEffect(() => {
    const { cameraRef } = scenesData[renderedScene]
    if (cameraRef.current === null) return
    setDefaultCamera(cameraRef.current as any)
  }, [renderedScene])

  useFrame(({ gl }) => {
    if (renderedScene === null) return
    if (!mountedScenes.includes(renderedScene))
      throw `Scene ${renderedScene} is not mounted`

    const { cameraRef, scene } = scenesData[renderedScene]

    if (cameraRef.current === null) return

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
            <CameraComponent ref={cameraRef} />
          </Fragment>
        )
      )}
    </>
  )
}

export default Scenes
