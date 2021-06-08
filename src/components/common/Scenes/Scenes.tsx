import * as THREE from 'three'
import shallow from 'zustand/shallow'
import React, { Fragment, Suspense, useEffect, useMemo, useRef } from 'react'
import { Camera, useFrame, useThree } from 'react-three-fiber'
import useSceneStore, { SceneData } from '@/stores/useSceneStore'
import TransitionScene from './TransitionScene/TransitionScene'
import SceneName from '@/constants/enums/SceneName'
import useSceneTransition from './useSceneTransition'
import { useControls } from 'leva'
import Scene from './Scene'

const Scenes = () => {
  const { size, gl } = useThree()

  const inTransition = useSceneStore((s) => s.inTransition)
  const transitionScene = useMemo(() => new THREE.Scene(), [])
  const transitionCam = useRef<THREE.Camera>(null)

  const { renderedSceneData, inProgress, outProgress } = useSceneTransition()

  const mountedSceneData = useSceneStore(
    (s) =>
      Object.fromEntries(
        s.mountedScenes.map((name) => [name, s.scenesData[name]])
      ),
    shallow
  )

  const transitionTarget = useRef(
    new THREE.WebGLMultisampleRenderTarget(size.width, size.height, {
      encoding: THREE.sRGBEncoding,
    })
  )
  useEffect(() => transitionTarget.current.setSize(size.width, size.height), [
    size,
  ])

  // Prerender a scene when it loads to avoid transition flicker
  // useEffect(() => {
  //   let lastLoadedScenes: SceneName[] = []
  //   let nullRenderTarget = new THREE.WebGLMultisampleRenderTarget(
  //     size.width,
  //     size.height
  //   )
  //   return useSceneStore.subscribe(
  //     (scenes: SceneName[]) => {
  //       for (const s of scenes) {
  //         if (lastLoadedScenes.includes(s)) return
  //         const d = useSceneStore.getState().scenesData[s]
  //         console.log('prerender', s)
  //         gl.setRenderTarget(nullRenderTarget)
  //         gl.render(d.scene, d.cameraRef.current)
  //         gl.setRenderTarget(null)
  //       }
  //       lastLoadedScenes = scenes
  //     },
  //     (s) =>
  //       Object.entries(s.scenesData)
  //         .filter(([_, data]) => data.isLoaded)
  //         .map(([name]) => name),
  //     shallow
  //   )
  // }, [])

  useFrame(({ gl, camera, setDefaultCamera }) => {
    if (
      renderedSceneData?.cameraRef?.current != null &&
      renderedSceneData.cameraRef.current !== camera
    )
      setDefaultCamera(renderedSceneData.cameraRef.current as Camera)

    gl.autoClear = true
    gl.setRenderTarget(inTransition ? transitionTarget.current : null)
    if (renderedSceneData !== null)
      gl.render(renderedSceneData.scene, renderedSceneData.cameraRef.current)
    if (inTransition) {
      gl.setRenderTarget(null)
      gl.render(transitionScene, transitionCam.current)
    }
  }, 100)

  return (
    <>
      {Object.entries(mountedSceneData).map(([name, sceneData]) => (
        <Scene key={name} name={name} sceneData={sceneData} />
      ))}
      <TransitionScene
        scene={transitionScene}
        ref={transitionCam}
        inTransition={inTransition}
        renderTarget={transitionTarget.current}
        inProgress={inProgress}
        outProgress={outProgress}
      />
    </>
  )
}

export default React.memo(Scenes)
