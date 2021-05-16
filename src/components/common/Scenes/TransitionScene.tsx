import * as THREE from 'three'
import { ForwardedRef, forwardRef, useEffect, useRef } from 'react'
import mergeRefs from 'react-merge-refs'
import { useThree } from 'react-three-fiber'
import withScenePortal from './withScenePortal'
import fragmentShader from './TransitionShader.fs'
import vertexShader from './TransitionShader.vs'
import { WatchableRefObject } from '@/hooks/useWatchableRef'
import useWatchableUniform from '@/hooks/uniforms/useWatchableUniform'

const TransitionScene = forwardRef(
  (
    {
      renderTarget,
      outProgress,
      inProgress,
    }: {
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
      </>
    )
  }
)

export default withScenePortal(TransitionScene)
