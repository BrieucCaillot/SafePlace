import * as THREE from 'three'
import { ForwardedRef, forwardRef, useEffect, useMemo, useRef } from 'react'
import mergeRefs from 'react-merge-refs'
import { useThree } from 'react-three-fiber'
import withScenePortal from '../withScenePortal'
import fragmentShader from './TransitionShader.fs'
import vertexShader from './TransitionShader.vs'
import useWatchableRef, { WatchableRefObject } from '@/hooks/useWatchableRef'
import useWatchableUniform from '@/hooks/uniforms/useWatchableUniform'
import Cloud from './Cloud'
import polarCoordinates from '@/utils/math/polarCoordinates'

const TransitionScene = forwardRef(
  (
    {
      renderTarget,
      outProgress,
      inProgress,
      inTransition,
    }: {
      inTransition: boolean
      renderTarget: THREE.WebGLRenderTarget
      outProgress: WatchableRefObject<number>
      inProgress: WatchableRefObject<number>
    },
    camRef: ForwardedRef<THREE.Camera>
  ) => {
    const localCamRef = useRef<THREE.OrthographicCamera>(null)

    const {
      size: { width, height },
    } = useThree()

    useEffect(() => {
      localCamRef.current.left = width / -2
      localCamRef.current.right = width / 2
      localCamRef.current.top = height / 2
      localCamRef.current.bottom = height / -2
      localCamRef.current.updateProjectionMatrix()
    }, [width, height])

    const uniforms = useRef<{ [name: string]: THREE.IUniform }>({
      uTexture: { value: renderTarget.texture },
      uOutProgress: { value: 0 },
      uInProgress: { value: 0 },
    })
    useWatchableUniform(uniforms.current.uInProgress, inProgress)
    useWatchableUniform(uniforms.current.uOutProgress, outProgress)

    const cloudTexture = useMemo(
      () => new THREE.TextureLoader().load('/img/common/cloud.png'),
      []
    )

    // Merge prog in one watchable ref
    const prog = useWatchableRef(0)
    useEffect(() => {
      const unsubs = [
        inProgress.onChange((v) => (prog.current = outProgress.current - v)),
        outProgress.onChange((v) => (prog.current = v - inProgress.current)),
      ]
      return () => unsubs.forEach((u) => u())
    }, [])

    return (
      <>
        <orthographicCamera
          ref={mergeRefs([localCamRef, camRef])}
          position-z={100}
        />
        <mesh scale={[width, height, 1]}>
          <planeGeometry />
          <shaderMaterial
            fragmentShader={fragmentShader}
            vertexShader={vertexShader}
            uniforms={uniforms.current}
          />
        </mesh>
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((offset) => (
          <Cloud
            key={offset}
            scale={[height * 1.5, height * 1.5, 1]}
            texture={cloudTexture}
            inProg={inProgress}
            outProg={outProgress}
            prog={prog}
            startPos={[
              ...polarCoordinates(Math.PI / 4 + offset, width * 1.2),
              0,
            ]}
            endPos={[...polarCoordinates(Math.PI / 4 + offset, width / 3), 0]}
          />
        ))}
      </>
    )
  }
)

export default withScenePortal(TransitionScene)
