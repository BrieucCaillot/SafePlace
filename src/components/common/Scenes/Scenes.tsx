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
import Easing from 'easing-functions'
import useSceneStore, { SceneData } from '@/stores/useSceneStore'
import useWatchableRef from '@/hooks/useWatchableRef'
import TransitionScene from './TransitionScene'

const Scenes = () => {
  const { size } = useThree()

  const [inTransition, setInTransition] = useState(false)

  const storeRenderedSceneData = useSceneStore((s) =>
    s.renderedScene ? s.scenesData[s.renderedScene] : null
  )
  const [renderedSceneData, setRenderedSceneData] = useState<SceneData>(
    storeRenderedSceneData
  )

  const mountedSceneData = useSceneStore(
    (s) => s.mountedScenes.map((name) => s.scenesData[name]),
    shallow
  )

  // Transition params
  const transitionScene = useMemo(() => new THREE.Scene(), [])
  const transitionCam = useRef<THREE.Camera>(null)
  const transitionTarget = useRef(
    new THREE.WebGLRenderTarget(size.width, size.height, {
      encoding: THREE.sRGBEncoding,
    })
  )
  useEffect(() => transitionTarget.current.setSize(size.width, size.height), [
    size,
  ])

  // Out anim
  const outProgress = useWatchableRef<number>(0)
  useEffect(() => {
    setInTransition(true)
    const anim = gsap.to(outProgress, {
      current: 1,
      ease: Easing.Linear.None,
      onComplete: () => {
        setRenderedSceneData(storeRenderedSceneData)
      },
    })
    return () => {
      anim.kill()
    }
  }, [storeRenderedSceneData])

  // In anim
  const inProgress = useWatchableRef<number>(0)
  useEffect(() => {
    const anim = gsap.to(inProgress, {
      current: 1,
      ease: Easing.Linear.None,
      onComplete: () => {
        inProgress.current = 0
        outProgress.current = 0
        setInTransition(false)
      },
    })
    return () => {
      anim.kill()
    }
  }, [renderedSceneData])

  useFrame(({ gl, camera, setDefaultCamera }) => {
    if (renderedSceneData === null) return

    const { cameraRef, scene } = renderedSceneData

    if (cameraRef.current == null) return
    if (cameraRef.current !== camera)
      setDefaultCamera(cameraRef.current as Camera)

    gl.autoClear = true
    if (inTransition) {
      gl.setRenderTarget(transitionTarget.current)
      gl.render(scene, cameraRef.current)
      gl.setRenderTarget(null)
      gl.render(transitionScene, transitionCam.current)
    } else gl.render(scene, cameraRef.current)
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
      <TransitionScene
        scene={transitionScene}
        ref={transitionCam}
        renderTarget={transitionTarget.current}
        inProgress={inProgress}
        outProgress={outProgress}
      />
    </>
  )
}

export default React.memo(Scenes)
