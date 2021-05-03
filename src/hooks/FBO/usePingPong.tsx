import { useFBO } from '@react-three/drei'
import { RefObject, useEffect, useMemo } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import { WatchableRefObject } from '../useWatchableRef'

const usePingPong = (
  bufferSize: THREE.Vector2Tuple,
  {
    cameraRef,
    sceneRef,
    quadTexture,
    particleTexture,
    initTextureRef,
    enable = true,
  }: {
    cameraRef: RefObject<THREE.Camera>
    sceneRef: RefObject<THREE.Scene>
    initTextureRef: WatchableRefObject<THREE.Texture>
    quadTexture: WatchableRefObject<THREE.Texture>
    particleTexture: WatchableRefObject<THREE.Texture>
    enable?: boolean
  }
) => {
  const initBufferSize = useMemo(() => [...bufferSize], [])
  let fbo1 = useFBO(initBufferSize[0], initBufferSize[1], {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    type: THREE.FloatType,
    stencilBuffer: false,
  })
  let fbo2 = useMemo(() => fbo1.clone(), [])

  useEffect(() => {
    fbo2.setSize(...bufferSize)
    fbo1.setSize(...bufferSize)
  }, [bufferSize[0], bufferSize[1]])

  const { gl } = useThree()

  useEffect(() => {
    if (sceneRef.current === null) throw 'No scene'
    if (cameraRef.current === null) throw 'No camera'
    quadTexture.current = initTextureRef.current

    gl.setRenderTarget(fbo1)
    gl.render(sceneRef.current, cameraRef.current)

    gl.setRenderTarget(fbo2)
    gl.render(sceneRef.current, cameraRef.current)
  }, [])

  useFrame(({ gl }) => {
    if (!enable) return
    if (sceneRef.current === null) return
    if (cameraRef.current === null) return
    let oldFbo1 = fbo1 // store A, the penultimate state
    fbo1 = fbo2 // advance A to the updated state
    fbo2 = oldFbo1
    quadTexture.current = fbo1.texture

    gl.setRenderTarget(fbo2)
    gl.render(sceneRef.current, cameraRef.current)
    // pass the new positional values to the scene users see

    gl.setRenderTarget(null)
    particleTexture.current = fbo2.texture
  }, 1)
}

export default usePingPong
