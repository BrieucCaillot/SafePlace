import * as THREE from 'three'
import shallow from 'zustand/shallow'
import React, {
  Fragment,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Camera, useFrame, useThree } from 'react-three-fiber'
import gsap from 'gsap'
import useSceneStore, { SceneData } from '@/stores/useSceneStore'
import useWatchableRef from '@/hooks/useWatchableRef'
import TransitionScene from './TransitionScene/TransitionScene'
import SceneName from '@/constants/enums/SceneName'
import useNonInitialEffect from '@/hooks/useNonInitialEffect'

const Scenes = () => {
  const { size } = useThree()

  const inTransition = useSceneStore((s) => s.inTransition)
  const setInTransition = useSceneStore((s) => s.setInTransition)
  const [waitForSceneLoad, setWaitForSceneLoad] = useState(false)

  const storeRenderedSceneData = useSceneStore((s) =>
    s.renderedScene ? s.scenesData[s.renderedScene] : null
  )
  const [renderedSceneData, setRenderedSceneData] = useState<SceneData>(
    storeRenderedSceneData
  )

  const mountedSceneData = useSceneStore(
    (s) =>
      Object.fromEntries(
        s.mountedScenes.map((name) => [name, s.scenesData[name]])
      ),
    shallow
  )
  const setSceneLoaded = useSceneStore((s) => s.setSceneLoaded)

  // Transition params
  const transitionScene = useMemo(() => new THREE.Scene(), [])
  const transitionCam = useRef<THREE.Camera>(null)
  const transitionTarget = useRef(
    new THREE.WebGLRenderTarget(size.width, size.height, {
      encoding: THREE.sRGBEncoding,
    })
  )
  const transitionAnimParams = useMemo<gsap.TweenVars>(
    () => ({
      ease: 'power3.out',
      duration: 2.5,
    }),
    []
  )
  useEffect(() => transitionTarget.current.setSize(size.width, size.height), [
    size,
  ])

  // Out anim
  const outProgress = useWatchableRef<number>(0)
  useNonInitialEffect(() => {
    setInTransition(true)
    const anim = gsap.to(outProgress, {
      current: 1,
      ...transitionAnimParams,
      onComplete: () => {
        setWaitForSceneLoad(true)
      },
    })
    return () => anim.kill()
  }, [storeRenderedSceneData])

  useNonInitialEffect(() => {
    if (!waitForSceneLoad || !storeRenderedSceneData?.isLoaded) return
    setRenderedSceneData(storeRenderedSceneData)
    setWaitForSceneLoad(false)
  }, [waitForSceneLoad, storeRenderedSceneData])

  // In anim
  const inProgress = useWatchableRef<number>(0)
  useNonInitialEffect(() => {
    const anim = gsap.to(inProgress, {
      current: 1,
      ...transitionAnimParams,
      onComplete: () => {
        inProgress.current = 0
        outProgress.current = 0
        setInTransition(false)
      },
    })
    return () => anim.kill()
  }, [renderedSceneData])

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
      {Object.entries(mountedSceneData).map(
        ([name, { Component, scene, cameraRef }]) => (
          <Fragment key={scene.uuid}>
            <Suspense fallback={'loading'}>
              <Component
                scene={scene}
                ref={(ref: THREE.Camera) => {
                  cameraRef.current = ref
                  setSceneLoaded(name as SceneName)
                }}
              />
            </Suspense>
          </Fragment>
        )
      )}
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
